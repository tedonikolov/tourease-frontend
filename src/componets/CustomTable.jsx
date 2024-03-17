import {Button, Table} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

export default function CustomTable({tableData, columns, darkHeader = true, viewComponent, checkStars, onDelete, onAction, actionIcon, disabled}) {
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
                            <tr key={itemIndex} className={`${disabled && !disabled(tableData[itemIndex]) && viewComponent ? 'hovered-row' : ''}`}>
                                {row.map((column, index) => (
                                    typeof column === 'boolean' ?
                                        <td key={index}
                                            onClick={() => {
                                                const id = tableData[itemIndex].id ?? 0;

                                                if (disabled && !disabled(tableData[itemIndex]) && viewComponent) {
                                                    viewComponent(id);
                                                }
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                id="checkbox"
                                                checked={column}
                                                readOnly={true}
                                            />
                                        </td>
                                        :
                                        <td key={index}
                                            onClick={() => {
                                                const id = tableData[itemIndex].id ?? 0;

                                                if (disabled && !disabled(tableData[itemIndex]) && viewComponent) {
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
                                {
                                    onAction && <td>
                                            <FontAwesomeIcon className={"icon-button"} icon={actionIcon(tableData[itemIndex])} onClick={()=>onAction(tableData[itemIndex])}/>
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