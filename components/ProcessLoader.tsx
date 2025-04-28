"use client"

import { Hourglass } from "react-loader-spinner"
const ProcessLoader = ({height = 24, width = 24, className="" }: any) => {
  return (
    <Hourglass 
     visible={true}
     height={height}
     width={width}
     ariaLabel="hourglass-loading"
     wrapperStyle={{}}
     wrapperClass={className}
     colors={["#306cce", "#72a1ed"]}
    />
  )
}

export default ProcessLoader