import CommonInputText from "./CommonInputText";
import React, {useState} from "react";
import {defaultRegular} from "../utils/defaultValues";
import CustomSelect from "./CustomSelect";
import CustomDatePicker from "./CustomDatePicker";
import {Button, Form} from "react-bootstrap";
import {sendRegularProfile} from "../hooks/Regular";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";

export default function RegularProfileInfo({userInfo, countries, setUserInfo}) {
    const [regular, setRegular] = useState(userInfo.regular ? userInfo.regular : defaultRegular);

    const gender = [{value: 'male', label: 'Male'},
        {value: 'female', label: 'Female'}]

    const disabled=regular.birthDate==='Invalid Date' || regular.birthDate===null;

    async function saveRegular(event) {
        event.preventDefault();
        const response = await sendRegularProfile(userInfo.email, regular);
        if(!response){
            setUserInfo({...userInfo, regular:regular});
            toast.success(<CustomToastContent content={['Information successfully updated!']}/>);
        }
    }

    return (
        <div className={'register-box'}>
            <Form id={'regular'} onSubmit={saveRegular}>
                <CommonInputText disabled={true} type={'text'} value={userInfo.email} label={'Email:'}/>
                <CommonInputText type={'text'} value={regular.firstName}
                                 label={'First name:'} name={'firstName'} setValue={setRegular}/>
                <CommonInputText type={'text'} value={regular.lastName}
                                 label={'Last name:'} name={'lastName'} setValue={setRegular}/>
                <CustomDatePicker label={'Date of birth'} selectedDate={regular.birthDate} name={'birthDate'}
                                  setValue={setRegular} isClearable={false}/>
                <CustomSelect options={countries} defaultValue={regular.country} setValue={setRegular} name={'country'}/>
                <CustomSelect options={gender} defaultValue={regular.gender} setValue={setRegular} name={'gender'}/>

                {disabled && <div className={"mt-4 text-danger"}>* Select valid passport date!</div>}
                <div className={"d-flex justify-content-center mt-3 mb-3"}>
                    <Button type={'submit'} className={'register-button'} disabled={disabled}>Update</Button>
                </div>
            </Form>
        </div>
    )
}