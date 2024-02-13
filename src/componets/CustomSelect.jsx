import Select from "react-select";
import React from "react";

export default function CustomSelect({options, setValue, name, defaultValue, isClearable=false}) {
    const defaultOption = options.find(option => option.value === defaultValue);

    return (
        <Select className={'mt-4 mb-4'}
                onChange={(newValue) => {
                    setValue((prevValue) => ({
                        ...prevValue,
                        [name]: newValue ? newValue.value : null
                    }));
                }}
                isClearable={isClearable}
                placeholder={`Choose ${name}`}
                defaultValue={defaultOption}
                options={options}
                required={true}
        />
    )
}