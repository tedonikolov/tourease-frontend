import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function NoDataComponent ({
    noDataText,
    iconSize,
    border,
}) {
    const { t } = useTranslation('translation', { keyPrefix: 'common' });
    return (
        <div
            className={`d-flex h-50 no-data-container flex-column justify-content-center align-items-center ${
                border && 'border border-secondary'
            } w-100`}
        >
            <FontAwesomeIcon icon={faClipboard} size={`${iconSize || '2x'}`} className='mb-3'></FontAwesomeIcon>
            <h4 className='text-center'>
                {t('noDataText', {
                    items: `${noDataText.toLowerCase()}`,
                })}
            </h4>
        </div>
    );
};
