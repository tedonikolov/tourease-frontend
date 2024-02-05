
export default function CommonInputText({label, name, disabled, type, readOnly, value, setValue, error, errorText}) {
    function handleInputChange(event) {
        event.preventDefault();
        setValue((prevValue) => ({
            ...prevValue,
            [name]:event.target.value
        }));
    }

    return (
        <>
            <div className='d-flex mt-3'>
                <label className={"w-100 text-start"}>{label}</label>
                <div className={"d-flex w-100 justify-content-end"}>
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
            </div>
            {error && <div className={"text-danger text-center mb-2"}>{errorText}</div>}
        </>
    )
}