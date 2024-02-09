import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import "react-datepicker/dist/react-datepicker.css";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function CustomDatePicker({selectedDate, setValue, name, label}) {

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    className={'mt-4'}
                    label={label}
                    value={dayjs(selectedDate)}
                    onChange={(date) => {
                        setValue((prevValue) => ({
                                ...prevValue,
                                [name]: date.format('YYYY-MM-DD')
                            })
                        );
                    }}
                    format={'DD-MM-YYYY'}
                />
            </LocalizationProvider>
        </div>
    );
}