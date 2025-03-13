import React from 'react'


export default function Table({ styles, headers, data, actions }) {
    return (
        headers && data &&
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
                {data.map((item, index) => (
                    <tr className={styles.bodyRow} key={index}>
                        <td className={styles.bodyCell}>{index + 1}</td>
                        {Object.values(item.tableData).map((value, index) => (
                            <td className={styles.bodyCell} key={index}>{value}</td>
                        ))}
                        {actions && actions.map((action, index) => (
                            <td className={`${styles.bodyCell}`} key={index}>
                                <button className={`${action.style}`} onClick={() => action.handler(item.obj)}>{action.name}</button>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table >
    )
}
