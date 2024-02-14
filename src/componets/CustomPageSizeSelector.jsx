import Select from "react-select";
import React from "react";
import {useTranslation} from "react-i18next";

export default function CustomPageSizeSelector({value, setValue}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"})

    const options = [{value: 10, label: 10},
        {value: 25, label: 25},
        {value: 50, label: 50},
        {value: 100, label: 100}];
    const defaultOption = options.find(option => option.value === value);

    return (
        <div className={'d-flex text-nowrap justify-content-center align-items-center text-center'}>
            <label className={'m-3 fw-bold'}>{t('choose page size')+':'}</label>
            <Select className={'mt-4 mb-4'}
                    onChange={(newValue) => {
                        setValue((prevValue) => ({
                                ...prevValue,
                                pageSize: newValue.value
                            })
                        );
                    }}
                    isClearable={false}
                    placeholder={t('choose page size')}
                    defaultValue={defaultOption}
                    options={options}
            />
        </div>
    )
}