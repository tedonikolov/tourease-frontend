import {Table} from "react-bootstrap";
import {useTranslation} from "react-i18next";

export default function CustomTable({tableData, columns, darkHeader = true, viewComponent, checkStars}) {
    const [t] = useTranslation("translation", {keyPrefix: 'table'});

    return (
        <div>
            <Table className={"table table-striped table-bordered"}>
                <thead className={`${darkHeader && 'table-dark'}`}>
                <tr>
                    {columns.headings.map((column, index) => (
                            <th key={index}>
                                {t(column)}
                            </th>
                        )
                    )}
                </tr>
                </thead>
                <tbody>
                {
                    columns.items.map((row, itemIndex) => (
                            <tr key={itemIndex} className={`${viewComponent ? 'hovered-row' : ''}`}>
                                {row.map((column, index) => (
                                    <td key={index}
                                        onClick={() => {
                                            const id = tableData[itemIndex].id ?? 0;

                                            if (viewComponent) {
                                                viewComponent(id);
                                            }
                                        }}
                                        >
                                        {checkStars ? checkStars(column) : column}
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