import { Pagination, Stack } from "@mui/material";

function ListPagination() {
    return (
        <Stack spacing={2}>
            <Pagination count={10} shape="rounded"></Pagination>
        </Stack>
    );
};

export default ListPagination;