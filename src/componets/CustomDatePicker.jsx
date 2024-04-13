import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import "react-datepicker/dist/react-datepicker.css";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function CustomDatePicker({selectedDate, setValue, name, label, minDate, disabled=false, disabledDates}) {
    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    className={'mt-4'}
                    minDate={minDate}
                    label={label}
                    value={selectedDate && dayjs(selectedDate)}
                    onChange={(date) => {
                        setValue((prevValue) => ({
                                ...prevValue,
                                [name]: date===null ? null : date.format('YYYY-MM-DD')
                            })
                        );
                    }}
                    format={'DD-MM-YYYY'}
                    disabled={disabled}
                    shouldDisableDate={(date) =>
                        disabledDates && disabledDates.some(disabledDate =>
                            dayjs(disabledDate).isSame(date, 'day')
                        )
                    }
                />
            </LocalizationProvider>
        </div>
    );
}