import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import React, { useState } from 'react';

const page = () => {
  // Sample rows data (50 rows for demo)
  const rows = Array(50).fill(null).map((_, index) => ({
    id: index + 1,
    ...Object.fromEntries(Array.from({ length: 5 }, (_, i) => [`Column ${i + 1}`, `Data ${index + 1}-${i + 1}`])),
  }));

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Number of rows per page

  // Calculate total number of pages
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  // Get the rows to display on the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = rows.slice(startIndex, startIndex + rowsPerPage);

  // Handle previous page
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle specific page number click
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Generate page numbers with ellipses
  const generatePageNumbers = () => {
    const pages = [];
    const range = 2; // How many pages before and after the current page to show

    if (totalPages <= 5) {
      // If there are fewer than 5 pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show the first page, last page, and the pages around the current page
      pages.push(1);
      if (currentPage > range + 1) pages.push('...');
      for (let i = Math.max(currentPage - range, 2); i <= Math.min(currentPage + range, totalPages - 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - range) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex-1 p-6 overflow-hidden">
      <div className="relative overflow-x-auto shadow-2xl sm:rounded-lg h-full">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
          {/* Table Header */}
          <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <tr>
              {Array.from({ length: 5 }, (_, i) => (
                <th key={i} className="px-6 py-4 text-left font-semibold">{`Column ${i + 1}`}</th>
              ))}
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {currentRows.map((row, index) => (
              <tr
                key={row.id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-700 rounded-lg transition duration-200 ease-in-out`}
              >
                {Object.keys(row).map((key, colIndex) => (
                  key !== 'id' && key !== 'Actions' ? (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row[key]}
                    </td>
                  ) : null
                ))}

                {/* Actions Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                  <Button
                    // onClick={() => handleEdit(row.id)}
                    className="text-[#006838] hover:bg-[#006838] hover:text-white transition-all duration-200"
                    variant="link"
                  >
                    <Edit />
                  </Button>
                  <Button
                    // onClick={() => handleDelete(row.id)}
                    className="text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                    variant="link"
                  >
                    <Trash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        {/* Previous Page Button */}
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-400 transition duration-200"
        >
          Previous
        </Button>

        {/* Page Number Controls */}
        {generatePageNumbers().map((page, index) => (
          <Button
            key={index}
            onClick={() => page !== '...' && handlePageClick(page)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              page === currentPage
                ? 'bg-[#006838] text-white hover:bg-[#006838]'
                : page === '...'
                ? 'bg-transparent text-gray-500'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
            disabled={page === '...'}
          >
            {page}
          </Button>
        ))}

        {/* Next Page Button */}
        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-400 transition duration-200"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default page;
