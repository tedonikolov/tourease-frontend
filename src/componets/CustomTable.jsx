import {Button, Table} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

export default function CustomTable({tableData, columns, darkHeader = true, viewComponent, checkStars, onDelete}) {
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
                                    typeof column === 'boolean' ?
                                        <td key={index}
                                            onClick={() => {
                                                const id = tableData[itemIndex].id ?? 0;

                                                if (viewComponent) {
                                                    viewComponent(id);
                                                }
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                id="checkbox"
                                                defaultChecked={column}
                                            />
                                        </td>
                                        :
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
                                {
                                    onDelete && <td>
                                        <Button size={'sm'} className={"delete-button"} onClick={()=>onDelete(tableData[itemIndex].id)}>
                                            <FontAwesomeIcon icon={faTrash} size={'sm'} />
                                        </Button>
                                    </td>
                                }
                            </tr>
                        )
                    )
                }
                </tbody>
            </Table>
        </div>
    )
}