export default function CustomCheckBox({name, label, value, setObjectValue, setValue}) {
    function handleInputChange(event) {
        setObjectValue ? setObjectValue((prevValue) => ({
                ...prevValue,
                [name]: event.target.checked
            }))
            :
            setValue(event.target.checked);
    }

    return (
        <div className='d-flex text-nowrap text-center mt-3'>
            <label className={"w-50 text-start"}>{label}:</label>
            <div className={"d-flex w-100 justify-content-start"}>
                <input
                    className={"mx-4"}
                    type={"checkbox"}
                    checked={value}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    )
}