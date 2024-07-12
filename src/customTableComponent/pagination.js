import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function PaginationRounded() {
  return (
    <Stack spacing={2}>
      {/* <Pagination count={10} shape="rounded" /> */}
      <Pagination
        count={10}
        page={1}
        // onChange={handleChange}
        variant="outlined"
        shape="rounded"
        defaultPage={6}
      />
    </Stack>
  );
}
