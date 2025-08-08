import React, { useEffect, useState } from 'react';

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

    useEffect(() => {
        if (page > totalPages && page !== 1) {
            setPage(totalPages);
        }

    }, [data]);

    useEffect(() => {
        if (page > totalPages && data.length % itemsPerPage === 0) {
            handlePageChange(page - 1);
        }
    }, [isRowLoading]);

    return (
        headers && data &&
        <>
            <table className={`table-auto text-center p-5 ${styles.table}`}>
                <thead className={styles.header}>
                    <tr>
                        <th className={styles.headerCell}>#</th>
                        {headers.map((header, index) => {
                            if (headers.length == 1 && headers[headers.length - 1] === header && !actions) {
                                return <th colSpan={2} className={styles.headerCell} key={index}>{header}</th>
                            }
                            else {
                                return <th className={styles.headerCell} key={index}>{header}</th>
                            }
                        }
                        )}
                        {actions && actions.buttons && actions.buttons.map((action, index) => (
                            <th className={styles.headerCell} key={index}>{action.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className={styles.body}>
                    {paginatedData.map((item, index) => (
                        <tr onClick={() => console.log("row clicked")} className={styles.bodyRow} key={index}>
                            {
                                isRowLoading ? <td className={styles.bodyCell} colSpan={headers.length + 1 + actions.buttons.length}><span className='loader'></span></td> :
                                    <>
                                        <td className={styles.bodyCell}>{(page - 1) * itemsPerPage + index + 1}</td>
                                        {Object.values(item.tableData).map((value, index) => {
                                            if (index === Object.values(item.tableData).length - 1 && headers.length == 1 && !actions) {

                                                return <td className={styles.bodyCell} colSpan={2} key={index}>{value}</td>
                                            }
                                            return <td className={styles.bodyCell} key={index}>{value}</td>
                                        })}
                                        {actions && actions.buttons && actions.buttons.map((action, index) => (
                                            <td className={`${styles.bodyCell}`} key={index}>
                                                <input type={action.type} value={action.name} checked={action.checked && action.checked(item.obj)} className={action.style}
                                                    onClick={(e) => action.onClick && action.onClick(item.obj, setIsRowLoading, e)}
                                                    onChange={(e) => action.onChange && action.onChange(item.obj, null, e)}></input>
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
                            Anterior
                        </td>
                        <td colSpan={headers.length + (actions && actions.buttons && (actions.buttons.length - 1))}><span className="mx-2">{page} of {totalPages}</span></td>
                        <td
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 mx-2 border rounded-lg"
                        >
                            Siguiente
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    );
}
