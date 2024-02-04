
export default function CommonInputText({label, name, disabled, type, readOnly, value, setValue}) {
    function handleInputChange(event) {
        event.preventDefault();
        setValue((prevValue) => ({
            ...prevValue,
            [name]:event.target.value
        }));
    }

    return (
        <div className='d-flex justify-content-between w-100'>
            <label>{label}</label>
            <input
                className={"mx-5"}
                type={type}
                readOnly={readOnly}
                value={value}
                disabled={disabled}
                onChange={handleInputChange}
                required
            />
        </div>
    )
}