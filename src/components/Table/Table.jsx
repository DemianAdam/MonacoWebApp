import React, { useState } from 'react';

export default function Table({ styles, headers, data, actions }) {
    const [page, setPage] = useState(1);
    const [isRowLoading, setIsRowLoading] = useState(false);
    const itemsPerPage = 10;

    // Calculate the data to display for the current page
    const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // Calculate the total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Change the page
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        headers && data &&
        <>
            <table className={`table-auto text-center p-5 ${styles.table}`}>
                <thead className={styles.header}>
                    <tr>
                        <th className={styles.headerCell}>#</th>
                        {headers.map((header, index) => (
                            <th className={styles.headerCell} key={index}>{header}</th>
                        ))}
                        {actions && actions.map((action, index) => (
                            <th className={styles.headerCell} key={index}>{action.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className={styles.body}>
                    {paginatedData.map((item, index) => (
                        <tr className={styles.bodyRow} key={index}>
                            {
                                isRowLoading ? <td className={styles.bodyCell} colSpan={headers.length + 1 + actions.length}><span className='loader'></span></td> :
                                    <>
                                        <td className={styles.bodyCell}>{(page - 1) * itemsPerPage + index + 1}</td>
                                        {Object.values(item.tableData).map((value, index) => (
                                            <td className={styles.bodyCell} key={index}>{value}</td>
                                        ))}
                                        {actions && actions.map((action, index) => (
                                            <td className={`${styles.bodyCell}`} key={index}>
                                                <button className={`${action.style}`} onClick={() => action.handler(item.obj,setIsRowLoading)}>{action.name}</button>
                                            </td>
                                        ))}
                                    </>
                            }

                        </tr>
                    ))}
                </tbody>
                <tfoot >
                    <tr className="">
                        <td
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 mx-2 border rounded-lg"
                        >
                            Previous
                        </td>
                        <td colSpan={2}><span className="mx-2">{page} of {totalPages}</span></td>
                        <td
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 mx-2 border rounded-lg"
                        >
                            Next
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    );
}
