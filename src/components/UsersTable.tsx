import React, { useMemo } from 'react'
import { useTable } from 'react-table'
import { useEffect, useState } from "react"
import { http } from "../util/http"
import { domain } from "../util/environnement"
import MOCK_DATA from '../MOCK_DATA.json'
import { COLUMNS } from '../columns'

const UsersTable: React.FunctionComponent = () => {
    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => MOCK_DATA, [])
    const [isPending, setIsPending] = useState(true)

    useEffect(() => {
        const token = sessionStorage.getItem("token")
        const options = {
          headers: { Authorization: `Bearer ${token}` },
        }
        http
          .get<[]>(`${domain}/v1/user`, options)
          .then(({ data, error }) => {
            setIsPending(true)
            if (!error) {
                //setPermissions(data)
                setIsPending(false)
            }
          })
    }, [])

    const tableInstance = useTable({
        columns,
        data
    })

    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        rows, 
        prepareRow,
    } = tableInstance

    return (
        <table {...getTableProps()}>
            <thead>
                {
                    headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {
                        headerGroup.headers.map( column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))
                    }
                    <th>Action</th>
                </tr>
                    ))}
            </thead>
            <tbody {...getTableBodyProps()} align="center">
                {
                    rows.map(row => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {
                                    row.cells.map((cell) => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })
                                }
                                <td><button className="action">EDIT</button></td>
                            </tr>
                        )
                    })
                } 
            </tbody>
        </table>
    )
}

export default UsersTable;