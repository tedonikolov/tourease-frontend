import {Pagination} from 'react-bootstrap';

export default function CustomPagination({recordsCount, pagination, setPagination}) {

    const pagesCount = Math.ceil(recordsCount / pagination.pageSize);
    const prev = () => {
        if (pagination.page > 1) {
            setPagination((preValue) => ({
                ...preValue,
                page: pagination.page - 1
            }));
        }
    };

    const next = () => {
        if (pagination.page < pagesCount) {
            setPagination((preValue) => ({
                ...preValue,
                page: pagination.page + 1
            }));
        }
    };

    return (
        <Pagination className='pt-2'>
            <Pagination.First onClick={() => setPagination((preValue) => ({
                ...preValue,
                page: 1
            }))}/>
            <Pagination.Prev onClick={prev}/>

            {Array.from(Array(pagesCount).keys())
                .map((page) => page + 1)
                .map((page, i) => {
                    return (
                        (page === pagesCount || page === 1 || (pagination.page + 3 > page && pagination.page - 3 < page)) && (
                            <Pagination.Item
                                key={i}
                                active={page === pagination.page}
                                onClick={() => {
                                    setPagination((preValue) => ({
                                        ...preValue,
                                        page: page
                                    }));
                                }}
                            >
                                {page}
                            </Pagination.Item>
                        )
                    );
                })}
            <Pagination.Next onClick={next}/>
            <Pagination.Last onClick={() => setPagination((preValue) => ({
                ...preValue,
                page: pagesCount
            }))
            }/>
        </Pagination>
    );
};