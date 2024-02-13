import {Table} from "react-bootstrap";

export default function CustomTable({columns}) {
    return (
        <div>
            <Table className={"table table-striped table-bordered"}>
                <thead className={"table-dark"}>
                <tr>
                    {columns.headings.map((column, index) => (
                        <th key={index}>
                            {column}
                        </th>
                        )
                    )}
                </tr>
                </thead>
                <tbody>
                {
                    columns.items.map((row, index) => (
                        <tr key={index}>
                            {row.map((column, index) => (
                                <td key={index}>
                                    {column}
                                </td>
                            ))}
                        </tr>
                        )
                    )
                }
                </tbody>
            </Table>
        </div>
    )
}