import CommonInputText from "./CommonInputText";
import React, {useState} from "react";
import {defaultRegular} from "../utils/defaultValues";
import CustomSelect from "./CustomSelect";
import CustomDatePicker from "./CustomDatePicker";
import {Button, Form} from "react-bootstrap";
import {sendRegularProfile} from "../hooks/Regular";

export default function RegularProfileInfo({userInfo, countries, setUserInfo}) {
    const [regular, setRegular] = useState(userInfo.regular ? userInfo.regular : defaultRegular);

    const gender = [{value: 'male', label: 'Male'},
        {value: 'female', label: 'Female'}]

    async function saveRegular() {
        const response = await sendRegularProfile(userInfo.email, regular);
        if(!response){
            setUserInfo({...userInfo, regular:regular})
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

                <div className={"d-flex justify-content-center mt-3 mb-3"}>
                    <Button type={'submit'} className={'register-button'}>Update</Button>
                </div>
            </Form>
        </div>
    )
}