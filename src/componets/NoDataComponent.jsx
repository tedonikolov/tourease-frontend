import {faClipboard} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import {useTranslation} from 'react-i18next';

export default function NoDataComponent({
                                            noDataText,
                                            iconSize,
                                            border,
                                            sentence,
                                            icon,
                                            color
                                        }) {
    const {t} = useTranslation('translation', {keyPrefix: 'common'});
    return (
        <div
            className={`d-flex h-50 no-data-container flex-column justify-content-center align-items-center ${
                border && 'border border-secondary'
            } w-100`}
        >
            <FontAwesomeIcon icon={icon ? icon : faClipboard} size={`${iconSize || '2x'}`} color={color || 'black'}
                             className='mb-3'></FontAwesomeIcon>
            <h4 className='text-center'>
                {noDataText && t('noDataText', {
                    items: `${noDataText.toLowerCase()}`,
                })}
                {
                    sentence && t(sentence)
                }
            </h4>
        </div>
    );
};
