import {Button, Table} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

export default function CustomTable({
                                        tableData,
                                        columns,
                                        darkHeader = true,
                                        viewComponent,
                                        checkStars,
                                        onDelete,
                                        onAction,
                                        actionIcon,
                                        disabled,
                                        tableColor
                                    }) {
    const [t] = useTranslation("translation", {keyPrefix: 'table'});

    return (
        <div>
            <Table className={"table table-striped table-bordered"}>
                <thead className={`${darkHeader && 'table-dark'}`}>
                <tr>
                    {columns.headings.map((column, index) => (
                            column && <th key={index}>
                                {t(column)}
                            </th>
                        )
                    )}
                </tr>
                </thead>
                <tbody>
                {
                    columns.items.map((row, itemIndex) => (
                            <tr key={itemIndex}
                                className={`${tableColor && tableColor} ${viewComponent ? !(disabled && disabled(tableData[itemIndex])) && 'hovered-row' : ''}`}>
                                {row.map((column, index) => (
                                    typeof column === 'boolean' ?
                                        <td key={index}
                                            onClick={() => {
                                                const id = tableData[itemIndex].id ?? 0;

                                                if (viewComponent) {
                                                    !(disabled && disabled(tableData[itemIndex])) && viewComponent(id);
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
                                        column && <td key={index}
                                                      onClick={() => {
                                                          const id = tableData[itemIndex].id ?? 0;

                                                          if (viewComponent) {
                                                              !(disabled && disabled(tableData[itemIndex])) && viewComponent(id);
                                                          }
                                                      }}
                                        >
                                            {checkStars ? checkStars(column) : column}
                                        </td>
                                ))}
                                {
                                    (onDelete || onAction) && <td className={"d-flex justify-content-between"}>
                                        {onAction && <Button size={'sm'} className={"icon-button"}>
                                            <FontAwesomeIcon className={"icon-button"} icon={actionIcon(tableData[itemIndex])}
                                                             onClick={() => onAction(tableData[itemIndex])}/>
                                        </Button>}
                                        {onDelete && <Button size={'sm'} className={"delete-button"}
                                                             onClick={() => onDelete(tableData[itemIndex].id)}>
                                            <FontAwesomeIcon icon={faTrash} size={'sm'}/>
                                        </Button>}
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