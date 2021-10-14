import React, { useMemo } from 'react'
import { useTable } from 'react-table'
import { useEffect, useState } from "react"
import { http } from "../util/http"
import { domain } from "../util/environnement"
import { USERSCOLUMNS } from '../usersColumns'
import Loading from "../components/loading/Loading"
import { PaginationModel } from '../models/pagination/pagination.model'

const UsersTable: React.FunctionComponent = () => {
    const [users, setUsers] = useState([])
    const columns = useMemo(() => USERSCOLUMNS, [USERSCOLUMNS])
    const data = useMemo(() => users, [users])
    const [isPending, setIsPending] = useState(true)

    useEffect(() => {
        const token = sessionStorage.getItem("token")
        const options = {
          headers: { Authorization: `Bearer ${token}` },
        }
        http
          .get<PaginationModel<any>>(`${domain}/v1/user`, options)
          .then(({ data , error }) => {
            setIsPending(true)
            if (!error) {
                setUsers(data.data)
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

    const onClick = (e: React.MouseEvent): void => {
        
    }

    return <>
        {isPending && <Loading />}
        {!isPending && (<>
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
                                    <td>
                                        <div className="actions">
                                            <button className="action">Edit</button>
                                            <button className="delete" onClick={(e) => onClick(e)}><i className="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    } 
                </tbody>
            </table>
        </>)}
    </>
}

export default UsersTable;