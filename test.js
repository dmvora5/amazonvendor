"use client";

import PropTypes from "prop-types";
import { createContext, useEffect, useReducer } from "react";
import { STORAGE_KEYS, USER_TYPES } from "@/constants/keywords";
import { API_ROUTER } from "@/services/apiRouter";
import { axiosGet, axiosPost } from "@/services/axiosHelper";
import { getUserRole } from "@/utils/helper";
import { setSession } from "@/utils/jwt";
import { getData, saveData } from "@/utils/storage";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  isLoading: false,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  UPDATE: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      user,
    };
  },
  LOADING: (state, action) => {
    const { isLoading } = action.payload;
    return {
      ...state,
      isLoading,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  update: () => Promise.resolve(),
  verifyCode: () => Promise.resolve(),
  forgotPasswordOTP: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  resendCode: () => Promise.resolve(),
});

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  // Hooks
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleRTExpiration = async () => {
    try {
      setSession(null);
      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    } catch (error) {}
  };

  const handleTokenExpiration = async () => {
    try {
      const rT = getData(STORAGE_KEYS.AUTH_REFRESH_TOKEN);
      const res = await axiosPost(API_ROUTER.REFRESH_TOKEN, {
        refresh: rT,
      });
      if (res.status) {
        setSession(res?.access, rT, handleTokenExpiration, handleRTExpiration);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = getData(STORAGE_KEYS.AUTH_TOKEN);
        const refreshToken = getData(STORAGE_KEYS.AUTH_REFRESH_TOKEN);
        const localAuth = getData(STORAGE_KEYS.AUTH);
        dispatch({
          type: "LOADING",
          payload: {
            isLoading: true,
          },
        });
        if (accessToken && localAuth) {
          setSession(
            accessToken,
            refreshToken,
            handleTokenExpiration,
            handleRTExpiration
          );

          const {
            data: { user },
          } = await axiosGet(API_ROUTER.GET_USER);

          saveData(STORAGE_KEYS.AUTH, {
            ...user,
            role: getUserRole(user),
            provider: localAuth?.provider,
          });

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user: {
                ...user,
                role: getUserRole(user),
                provider: localAuth?.provider,
              },
            },
          });
          dispatch({
            type: "LOADING",
            payload: {
              isLoading: false,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
          dispatch({
            type: "LOADING",
            payload: {
              isLoading: false,
            },
          });
        }
      } catch (err) {
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
        dispatch({
          type: "LOADING",
          payload: {
            isLoading: false,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (payload, provider, type = "") => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        // dispatch({
        //   type: "LOADING",
        //   payload: {
        //     isLoading: true,
        //   },
        // });
        const res = await axiosPost(
          type === USER_TYPES.VISITOR
            ? API_ROUTER.LOGIN(provider)
            : API_ROUTER.BUSINESS_LOGIN(provider),
          {
            ...payload,
          }
        );

        if (res.status) {
          if (type === USER_TYPES.VISITOR) {
            const {
              tokens: { access, refresh },
              user,
            } = res;
            setSession(
              access,
              refresh,
              handleTokenExpiration,
              handleRTExpiration
            );
            saveData(STORAGE_KEYS.AUTH, {
              ...user,
              provider,
              role: getUserRole(user),
            });
            dispatch({
              type: "LOGIN",
              payload: {
                user: { ...user, provider, role: getUserRole(user) },
              },
            });
            // dispatch({
            //   type: "LOADING",
            //   payload: {
            //     isLoading: false,
            //   },
            // });
            resolve({
              status: true,
              data: { ...res.user, role: getUserRole(user) },
            });
          } else
            resolve({
              status: true,
              data: { ...res.data },
            });
        } else {
          resolve({
            status: false,
            data: "",
            message:
              res?.data?.response?.data?.non_field_errors?.at(0) ||
              res?.data?.non_field_errors?.at(0) ||
              res?.message ||
              "something went wrong",
          });
          // dispatch({
          //   type: "LOADING",
          //   payload: {
          //     isLoading: false,
          //   },
          // });
        }
      } catch (error) {
        resolve({ status: false, data: "" });
      }
    });
  };

  const verifyCode = async (code, type) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        dispatch({
          type: "LOADING",
          payload: {
            isLoading: true,
          },
        });
        const res = await axiosPost(API_ROUTER.BUSINESS_VERIFY_CODE, {
          code,
        });
        dispatch({
          type: "LOADING",
          payload: {
            isLoading: false,
          },
        });
        if (res.status) {
          if (type === USER_TYPES.BUSINESS_OWNER) {
            const {
              tokens: { access, refresh },
              user,
            } = res;
            logout();
            setSession(
              access,
              refresh,
              handleTokenExpiration,
              handleRTExpiration
            );
            saveData(STORAGE_KEYS.AUTH, {
              ...user,
              type,
              role: getUserRole(user),
            });
            dispatch({
              type: "LOGIN",
              payload: {
                user: { ...user, role: getUserRole(user) },
              },
            });
          }
          resolve({
            status: true,
            data: { ...res, type },
          });
        } else {
          resolve({
            status: false,
            data: "",
            message:
              res?.data?.response?.non_field_errors[0] ||
              "something went wrong",
          });
        }
      } catch (error) {
        resolve({ status: false, data: "" });
      }
    });
  };

  const resendCode = async (payload, provider, type = "") => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const res = await axiosPost(
          type === USER_TYPES.VISITOR
            ? API_ROUTER.LOGIN(provider)
            : API_ROUTER.BUSINESS_LOGIN(provider),
          {
            ...payload,
          }
        );
        if (res.status) {
          if (type === USER_TYPES.VISITOR) {
            const {
              tokens: { access, refresh },
              ...data
            } = res;
            setSession(
              access,
              refresh,
              handleTokenExpiration,
              handleRTExpiration
            );
            saveData(STORAGE_KEYS.AUTH, {
              ...data,
              provider,
              role: getUserRole(data),
            });
            dispatch({
              type: "LOGIN",
              payload: {
                user: { ...data, provider, role: getUserRole(data) },
              },
            });
            dispatch({
              type: "LOADING",
              payload: {
                isLoading: false,
              },
            });
            resolve({
              status: true,
              data: { ...res.data, role: getUserRole(res?.data) },
            });
          } else
            resolve({
              status: true,
              data: { ...res.data },
            });
        } else {
          resolve({
            status: false,
            data: "",
            message:
              res?.data?.response?.data?.non_field_errors[0] ||
              "something went wrong",
          });
          dispatch({
            type: "LOADING",
            payload: {
              isLoading: false,
            },
          });
        }
      } catch (error) {
        resolve({ status: false, data: "" });
      }
    });
  };

  const register = async (payLoad, type) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const res = await axiosPost(
          type === USER_TYPES.VISITOR
            ? API_ROUTER.VISITOR_REGISTER
            : API_ROUTER.BUSINESS_REGISTER,
          {
            ...payLoad,
          }
        );
        if (res.status) {
          if (type === USER_TYPES.VISITOR) {
            const {
              data,
              tokens: { access, refresh },
            } = res;
            setSession(
              access,
              refresh,
              handleTokenExpiration,
              handleRTExpiration
            );
            saveData(STORAGE_KEYS.AUTH, data);
            dispatch({
              type: "REGISTER",
              payload: {
                user: data,
              },
            });
          }
          resolve({ status: true, data: res?.details, message: res?.details });
        } else {
          resolve({
            status: false,
            data: "",
            message:
              res?.data?.details ||
              res?.data?.response?.non_field_errors[0] ||
              res?.data?.email[0] ||
              "something went wrong",
          });
        }
      } catch (error) {
        resolve({ status: false, data: "" });
      }
    });
  };

  const update = async () => {
    try {
      const response = await axiosGet(API_ROUTER.GET_USER);

      if (response.status) {
        dispatch({
          type: "UPDATE",
          payload: {
            user: {
              ...response?.data?.user,
              role: getUserRole(response?.data?.user),
            },
          },
        });
      } else {
        dispatch({
          type: "UPDATE",
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {}
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  const forgotPasswordOTP = async (email)
 => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const res = await axiosPost(API_ROUTER.FORGOT_PASSWORD_EMAIL, {
          email,
        });
        if (res.status) {
          resolve({ status: true, data: res?.details });
        } else {
          resolve({
            status: false,
            data: "",
            message:
              res?.data?.response?.data?.detail[0] ||
              res?.data?.response?.non_field_errors[0] ||
              "something went wrong",
          });
        }
      } catch (error) {
        resolve({
          status: false,
          data: "",
          message: "Enter a valid email address",
        });
      }
    });
  };

  const forgotPassword = async (code, password, confirm_password) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const res = await axiosPost(API_ROUTER.FORGOT_PASSWORD, {
          code,
          password,
          confirm_password,
        });
        if (res.status) {
          resolve({ status: true, data: res?.details });
        } else {
          resolve({
            status: false,
            data: "",
            message:
              res?.data?.response?.data?.non_field_errors[0] ||
              "something went wrong",
          });
        }
      } catch (error) {
        resolve({ status: false, data: "", message: "something went wrong" });
      }
    });
  };

  const resetPassword = async ({ code, password, confirm_password }) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const res = await axiosPost(API_ROUTER.RESET_PASSWORD, {
          code,
          password,
          confirm_password,
        });
        if (res.status) {
          resolve({ status: true, data: res?.details });
        } else {
          resolve({
            status: false,
            data: "",
            message:
              res?.data?.non_field_errors[0] ||
              res?.data?.code[0] ||
              res?.data?.password[0] ||
              res?.data?.confirm_password[0] ||
              "something went wrong",
          });
        }
      } catch (error) {
        resolve({ status: false, data: "", message: "something went wrong" });
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        update,
        verifyCode,
        forgotPasswordOTP,
        forgotPassword,
        resetPassword,
        resendCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };