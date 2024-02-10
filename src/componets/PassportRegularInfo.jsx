import React, {useState} from "react";
import {defaultPassport} from "../utils/defaultValues";
import CommonInputText from "./CommonInputText";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import {Button, Form} from "react-bootstrap";
import {sendRegularPassport} from "../hooks/Regular";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";

export default function PassportRegularInfo({userInfo, countries, setUserInfo}) {
    const [passport, setPassport] = useState(userInfo.regular && userInfo.regular.passport ? userInfo.regular.passport : defaultPassport);

    const disabled= passport.expirationDate==='Invalid Date' || passport.expirationDate===null || passport.creationDate==='Invalid Date' || passport.creationDate===null

    async function savePassport(event) {
        event.preventDefault()
        const response = await sendRegularPassport(userInfo.email, passport);
        if (!response) {
            passport.expired=false;
            setUserInfo({...userInfo, regular: {...userInfo.regular, passport: passport}});
            toast.success(<CustomToastContent content={['Passport successfully updated!']}/>);
        }
    }

    return (
        <div className={'register-box'}>
            {userInfo.regular ?
                <div>
                    <Form id={'passport'} onSubmit={savePassport}>
                        {passport.expired && <div className={"mt-4 text-danger"}>* Your passport has been expired! Please update it.</div>}
                        <CommonInputText type={'text'} value={passport.passportId}
                                         label={'Passport number:'} name={'passportId'} setValue={setPassport}/>
                        <CustomDatePicker label={'Creation date'} selectedDate={passport.creationDate}
                                          name={'creationDate'}
                                          setValue={setPassport}/>
                        <CustomDatePicker label={'Expiration date'} selectedDate={passport.expirationDate}
                                          name={'expirationDate'} minDate={dayjs()}
                                          setValue={setPassport}/>
                        <CustomSelect options={countries}
                                      defaultValue={passport.country}
                                      setValue={setPassport} name={'country'}/>
                        {disabled && <div className={"mt-4 text-danger"}>* Select valid passport date!</div>}
                        <div className={"d-flex justify-content-center mt-3 mb-3"}>
                            <Button type={'submit'} className={'register-button'} disabled={disabled}>Update</Button>
                        </div>
                    </Form>
                </div>
                :
                <div>
                    <h1>Please first add personal info</h1>
                </div>
            }
        </div>
    )
}