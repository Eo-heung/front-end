import { Pagination, Stack } from "@mui/material";

function ListPagination({ count, currentPage, onChange }) {
    return (
        <Stack spacing={2} style={{ width: "350px" }}>
            <Pagination
                count={count}
                page={currentPage}
                onChange={onChange}
                shape="rounded"
            ></Pagination>
        </Stack>
    );
};

export default ListPagination;