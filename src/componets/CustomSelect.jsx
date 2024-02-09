import Select from "react-select";
import React from "react";

export default function CustomSelect({options,setValue,name, defaultValue}) {
    return (
        <Select className={'mt-4 mb-4'}
                onChange={(newValue) => {
                    setValue((prevValue) => ({
                        ...prevValue,
                        [name]: newValue.value
                    }));
                }}
                placeholder={`Choose ${name}`}
                defaultValue={defaultValue}
                options={options}
                required={true}
        />
    )
}