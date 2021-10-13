import React, { useMemo } from 'react'
import { useTable } from 'react-table'
import { useEffect, useState } from "react"
import { http } from "../util/http"
import { domain } from "../util/environnement"
import { ROLESCOLUMNS } from '../rolesColumns'
import Loading from "../components/loading/Loading"
import { PaginationModel } from '../models/pagination/pagination.model'

const RolesTable: React.FunctionComponent = () => {
    const [roles, setRoles] = useState([])
    const columns = useMemo(() => ROLESCOLUMNS, [ROLESCOLUMNS])
    const data = useMemo(() => roles, [roles])
    const [isPending, setIsPending] = useState(true)

    useEffect(() => {
        const token = sessionStorage.getItem("token")
        const options = {
          headers: { Authorization: `Bearer ${token}` },
        }
        http
          .get<PaginationModel<any>>(`${domain}/v1/role`, options)
          .then(({ data , error }) => {
            setIsPending(true)
            if (!error) {
                setRoles(data.data)
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
                                    <td><button className="action">EDIT</button></td>
                                </tr>
                            )
                        })
                    } 
                </tbody>
            </table>
        </>)}
    </>
}

export default RolesTable;