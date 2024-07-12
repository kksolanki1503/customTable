import { useEffect } from "react";
import { useState } from "react";
import BasicDatePicker from "./dateComponent";
import PaginationRounded from "./pagination";
import BasicMenu from "./columnFilter";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const CustomTableComponent = ({
  title = "",
  data = [],
  columns = [],
  search = true,
  dateFilter = true,
  download = true,
}) => {
  const [tabledata, setTableData] = useState(data);
  const [searchText, setSearchText] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [rowsToShow, setRowsToShow] = useState(10);
  const [totalRows, setTotalRows] = useState(data?.length);
  const [columnsData, setColumnsData] = useState(columns.slice(0, 4));
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const handleDateFromChange = (e) => {
    const dateObject = new Date(e);
    console.log(dateObject, "new Date");
    const day = dateObject.getDate();
    const month = dateObject.toLocaleString("default", { month: "long" }); // Get full month name
    const year = dateObject.getFullYear();
    // console.log(day, "day");
    const dateFormated = `${day} ${month} ${year}`;
    setDateFrom(dateObject);

    // setDateFrom(e.target.value);
  };
  const handleDateToChange = (e) => {
    const dateObject = new Date(e);
    // console.log(dateObject, "new Date");
    const day = dateObject.getDate();
    const month = dateObject.toLocaleString("default", { month: "long" }); // Get full month name
    const year = dateObject.getFullYear();
    // console.log(day, "day");
    const dateFormated = `${day} ${month} ${year}`;
    setDateTo(dateObject);

    // setDateTo(e.target.value);
  };

  const filterDataByDate = (data, fromDate, toDate) => {
    if (!fromDate || !toDate) return data;

    return data.filter((item) => {
      // console.log(item, "data to be filted");
      const itemDate = new Date(item.Date);
      // console.log(itemDate, "date to be filted");
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  const searchFilterData = (query, d) => {
    return d.filter((item) => {
      return Object.keys(item).some((key) => {
        return String(item[key]).toLowerCase().includes(query.toLowerCase());
      });
    });
  };
  const downloadCSV = () => {
    const csvRows = [];
    const headers = columnsData.map((col) => {
      if (col.label == "Actions") return;
      return col.label;
    });
    csvRows.push(headers.join(","));

    tabledata.forEach((row) => {
      const values = columnsData.map((col) => {
        if (col.name == "Actions") return;
        const escaped = ("" + row[col.name]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    // console.log(blob, "blob");
    const url = window.URL.createObjectURL(blob);
    // console.log(url, "url");
    const a = document.createElement("a");

    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    // console.log(a, "a object");
    a.setAttribute("download", "table_data.csv");

    document.body.appendChild(a);

    a.click();
    document.body.removeChild(a);
  };
  const handleSort = (columnName) => {
    let direction = "asc";
    if (sortConfig.key === columnName && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnName, direction });

    const sortedData = [...tabledata].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setTableData(sortedData);
  };
  const handleDelete = (id) => {
    console.log(id, "delteding id");
    const filteredData = tabledata.filter((item) => item.id !== id);
    setTableData(filteredData);
  };

  useEffect(() => {
    //filterByDate
    if (dateFilter && dateFrom && dateTo) {
      const filteredData = filterDataByDate(data, dateFrom, dateTo);
      setTableData(filteredData);
      // console.log(filteredData, "filtered by date");
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    // filterBySearch
    if (search) {
      // console.log(searchText, "searchText");
      // console.log(filterData(searchText, data), "filterData");

      const filteredData = searchFilterData(searchText, data);
      // console.log(searchFilterData, "filteredData");
      setTableData(filteredData);
      // setTableData(columns);
    }
  }, [searchText]);

  // console.log(tabledata, "tableData");
  // console.log(dateFrom, "dateFrom");
  // console.log(dateTo, "dateTo");
  return (
    <div className="px-5">
      <header className="flex justify-between py-6  items-center">
        <div className="text-3xl ">{title}</div>
        <div className="flex gap-8 justify-center items-center">
          <Tooltip title="Add New">
            <IconButton>
              <button className="bg-[#EBD37D] flex justify-center items-center gap-2 px-2 py-1 rounded">
                <div className="text-[16px] font-medium">Add New</div>

                <div>
                  <svg
                    enableBackground="new 0 0 50 50"
                    height="20px"
                    id="Layer_1"
                    version="1.1"
                    viewBox="0 0 50 50"
                    width="20px"
                    xmlSpace="preserve"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <rect fill="none" height={50} width={50} />
                    <line
                      fill="none"
                      stroke="#000000"
                      strokeMiterlimit={10}
                      strokeWidth={4}
                      x1={9}
                      x2={41}
                      y1={25}
                      y2={25}
                    />
                    <line
                      fill="none"
                      stroke="#000000"
                      strokeMiterlimit={10}
                      strokeWidth={4}
                      x1={25}
                      x2={25}
                      y1={9}
                      y2={41}
                    />
                  </svg>
                </div>
              </button>
            </IconButton>
          </Tooltip>

          {download && (
            <Tooltip title="Download">
              <IconButton>
                <button onClick={downloadCSV}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                  >
                    <path
                      d="M9.87816 18.622C11.0494 19.794 12.9488 19.7946 14.1208 18.6234C14.1213 18.6229 14.1217 18.6225 14.1222 18.622L17.3332 15.411C17.7036 15.0014 17.6717 14.369 17.2621 13.9986C16.8807 13.6537 16.2999 13.6543 15.9192 14L12.9932 16.927L13.0002 1.50003C13.0001 0.947703 12.5524 0.5 12.0001 0.5C11.4479 0.5 11.0002 0.947703 11.0002 1.49998L10.9912 16.908L8.08116 14C7.69041 13.6095 7.05713 13.6098 6.66666 14.0005C6.27619 14.3913 6.27643 15.0245 6.66718 15.415L9.87816 18.622Z"
                      fill="#333333"
                    />
                    <path
                      d="M23 16.5C22.4477 16.5 22 16.9477 22 17.5V21.5C22 22.0523 21.5523 22.5 21 22.5H3C2.44772 22.5 2.00002 22.0523 2.00002 21.5V17.5C2.00002 16.9477 1.55231 16.5 1.00003 16.5C0.447703 16.5 0 16.9477 0 17.5V21.5C0 23.1569 1.34316 24.5 3 24.5H21C22.6568 24.5 24 23.1569 24 21.5V17.5C24 16.9477 23.5523 16.5 23 16.5Z"
                      fill="#333333"
                    />
                  </svg>
                </button>
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Filter">
            <BasicMenu columns={columns} setColumnsData={setColumnsData} />
          </Tooltip>
        </div>
      </header>
      <div className="flex flex-col sm:flex-row  justify-between items-center w-full mb-4 ">
        <div className="w-full">
          {search && (
            <input
              className="border px-3 py-1 outline-none"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
            />
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {dateFilter && (
            <>
              <BasicDatePicker
                title="From"
                selectedDate={dateFrom}
                handleDateChange={handleDateFromChange}
              />
              <BasicDatePicker
                title="To"
                selectedDate={dateTo}
                handleDateChange={handleDateToChange}
              />
            </>
          )}
        </div>
      </div>
      <div className="overflow-x-scroll relative">
        <table className="w-full text-nowrap">
          <thead className=" text-left">
            <tr className="">
              {columnsData?.map((column, index) => {
                if (column.id === 1) {
                  return (
                    <th
                      key={index}
                      className="py-2 pr-24 cursor-pointer"
                      onClick={() => handleSort(column.name)}
                    >
                      <div className="flex gap-4">
                        <div> {column.label}</div>

                        <div
                          className={` duration-100 ${
                            sortConfig.direction === "asc" &&
                            sortConfig.key === column.name
                              ? "rotate-0"
                              : "rotate-180"
                          }`}
                        >
                          <ArrowDropUpIcon />
                        </div>
                      </div>
                    </th>
                  );
                }
                // if (column.name === "Actions") {
                //   return (
                //     <th key={index} className="py-2 px-24 ">
                //       <div className="flex gap-4">
                //         <div> {column.label}</div>
                //       </div>
                //     </th>
                //   );
                // }
                return (
                  <th
                    key={index}
                    className="py-2 px-24 cursor-pointer"
                    onClick={() => handleSort(column.name)}
                  >
                    <div className="flex gap-4">
                      <div> {column.label}</div>

                      <div
                        className={` duration-100 ${
                          sortConfig.direction === "asc" &&
                          sortConfig.key === column.name
                            ? "rotate-0"
                            : "rotate-180"
                        }`}
                      >
                        <ArrowDropUpIcon />
                      </div>
                    </div>
                  </th>
                );
              })}
              <th className="py-2 px-24 sticky right-0 bg-white">
                <div className="flex gap-4">
                  <div> {"Actions"}</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="">
            {tabledata?.map((row, rowIndex) => (
              <tr className="border-b" key={rowIndex}>
                {columnsData.map((column, columnIndex) => {
                  if (column.id === 1) {
                    return (
                      <td className={`py-2 pr-24 `} key={columnIndex}>
                        {row[column.name]}
                      </td>
                    );
                  }
                  if (column.name === "Amount") {
                    return (
                      <td
                        className={`py-2 px-24 ${
                          row[column.name].includes("Cr")
                            ? " text-[#588B58]"
                            : "text-[#B15151]"
                        }`}
                        key={columnIndex}
                      >
                        {row[column.name]}
                      </td>
                    );
                  }
                  // if (column.name === "Actions") {
                  //   return (
                  //     <td className="py-2 px-24" key={columnIndex}>
                  //       <div className="flex gap-5">
                  //         <Tooltip title="Delete">
                  //           <IconButton>
                  //             <button //delete
                  //               onClick={() => handleDelete(row["id"])}
                  //             >
                  //               <svg
                  //                 xmlns="http://www.w3.org/2000/svg"
                  //                 width="16"
                  //                 height="17"
                  //                 viewBox="0 0 16 17"
                  //                 fill="none"
                  //               >
                  //                 <path
                  //                   d="M15.3333 3.50012C15.3333 2.94784 14.8856 2.50012 14.3333 2.50012H11.816C11.3947 1.30503 10.2671 0.504185 8.99997 0.500122H6.99997C5.73281 0.504185 4.60522 1.30503 4.18397 2.50012H1.66663C1.11434 2.50012 0.666626 2.94784 0.666626 3.50012C0.666626 4.0524 1.11434 4.50012 1.66663 4.50012H1.99997V12.8335C1.99997 14.8585 3.64159 16.5001 5.66663 16.5001H10.3333C12.3583 16.5001 14 14.8585 14 12.8335V4.50012H14.3333C14.8856 4.50012 15.3333 4.0524 15.3333 3.50012ZM12 12.8335C12 13.7539 11.2538 14.5001 10.3333 14.5001H5.66663C4.74616 14.5001 3.99997 13.7539 3.99997 12.8335V4.50012H12V12.8335Z"
                  //                   fill="#AE3628"
                  //                 />
                  //                 <path
                  //                   d="M6.33331 12.5001C6.88559 12.5001 7.33331 12.0524 7.33331 11.5001V7.50012C7.33331 6.94784 6.88559 6.50012 6.33331 6.50012C5.78103 6.50012 5.33331 6.94784 5.33331 7.50012V11.5001C5.33331 12.0524 5.78103 12.5001 6.33331 12.5001Z"
                  //                   fill="#AE3628"
                  //                 />
                  //                 <path
                  //                   d="M9.66663 12.5001C10.2189 12.5001 10.6666 12.0524 10.6666 11.5001V7.50012C10.6666 6.94784 10.2189 6.50012 9.66663 6.50012C9.11434 6.50012 8.66663 6.94784 8.66663 7.50012V11.5001C8.66663 12.0524 9.11434 12.5001 9.66663 12.5001Z"
                  //                   fill="#AE3628"
                  //                 />
                  //               </svg>
                  //             </button>
                  //           </IconButton>
                  //         </Tooltip>

                  //         <Tooltip title="Delete">
                  //           <IconButton>
                  //             <button //edite
                  //             >
                  //               <svg
                  //                 xmlns="http://www.w3.org/2000/svg"
                  //                 width="16"
                  //                 height="17"
                  //                 viewBox="0 0 16 17"
                  //                 fill="none"
                  //               >
                  //                 <g clip-path="url(#clip0_26_747)">
                  //                   <path
                  //                     d="M15.2161 1.28412C14.7066 0.797222 14.0289 0.525513 13.3241 0.525513C12.6193 0.525513 11.9417 0.797222 11.4321 1.28412L1.07413 11.6421C0.732739 11.9816 0.462042 12.3855 0.277695 12.8303C0.0933478 13.2751 -0.00099165 13.752 0.000131991 14.2335V15.5001C0.000131991 15.7653 0.105489 16.0197 0.293025 16.2072C0.480562 16.3948 0.734916 16.5001 1.00013 16.5001H2.2668C2.7485 16.5014 3.22568 16.4072 3.67071 16.2228C4.11574 16.0385 4.51979 15.7677 4.85947 15.4261L15.2161 5.06812C15.7172 4.56595 15.9986 3.88552 15.9986 3.17612C15.9986 2.46672 15.7172 1.7863 15.2161 1.28412ZM3.44413 14.0121C3.13106 14.3232 2.70812 14.4985 2.2668 14.5001H2.00013V14.2335C2.0015 13.7917 2.17682 13.3682 2.48813 13.0548L10.2001 5.34479L11.1555 6.30012L3.44413 14.0121ZM13.8001 3.65412L12.5695 4.88679L11.6135 3.93079L12.8468 2.70012C12.9754 2.57717 13.1465 2.50856 13.3245 2.50856C13.5024 2.50856 13.6735 2.57717 13.8021 2.70012C13.9279 2.82716 13.9982 2.99879 13.9979 3.17753C13.9975 3.35627 13.9264 3.52761 13.8001 3.65412Z"
                  //                     fill="#5A6ACF"
                  //                   />
                  //                 </g>
                  //                 <defs>
                  //                   <clipPath id="clip0_26_747">
                  //                     <rect
                  //                       width="16"
                  //                       height="16"
                  //                       fill="white"
                  //                       transform="translate(0 0.500122)"
                  //                     />
                  //                   </clipPath>
                  //                 </defs>
                  //               </svg>
                  //             </button>
                  //           </IconButton>
                  //         </Tooltip>
                  //       </div>
                  //     </td>
                  //   );
                  // }
                  return (
                    <>
                      <td className="py-2 px-24" key={columnIndex}>
                        {row[column.name]}
                      </td>
                    </>
                  );
                })}
                <td className="py-2 px-24 sticky right-0 bg-white">
                  <div className="flex gap-5">
                    <Tooltip title="Delete">
                      <IconButton>
                        <button //delete
                          onClick={() => handleDelete(row["id"])}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                          >
                            <path
                              d="M15.3333 3.50012C15.3333 2.94784 14.8856 2.50012 14.3333 2.50012H11.816C11.3947 1.30503 10.2671 0.504185 8.99997 0.500122H6.99997C5.73281 0.504185 4.60522 1.30503 4.18397 2.50012H1.66663C1.11434 2.50012 0.666626 2.94784 0.666626 3.50012C0.666626 4.0524 1.11434 4.50012 1.66663 4.50012H1.99997V12.8335C1.99997 14.8585 3.64159 16.5001 5.66663 16.5001H10.3333C12.3583 16.5001 14 14.8585 14 12.8335V4.50012H14.3333C14.8856 4.50012 15.3333 4.0524 15.3333 3.50012ZM12 12.8335C12 13.7539 11.2538 14.5001 10.3333 14.5001H5.66663C4.74616 14.5001 3.99997 13.7539 3.99997 12.8335V4.50012H12V12.8335Z"
                              fill="#AE3628"
                            />
                            <path
                              d="M6.33331 12.5001C6.88559 12.5001 7.33331 12.0524 7.33331 11.5001V7.50012C7.33331 6.94784 6.88559 6.50012 6.33331 6.50012C5.78103 6.50012 5.33331 6.94784 5.33331 7.50012V11.5001C5.33331 12.0524 5.78103 12.5001 6.33331 12.5001Z"
                              fill="#AE3628"
                            />
                            <path
                              d="M9.66663 12.5001C10.2189 12.5001 10.6666 12.0524 10.6666 11.5001V7.50012C10.6666 6.94784 10.2189 6.50012 9.66663 6.50012C9.11434 6.50012 8.66663 6.94784 8.66663 7.50012V11.5001C8.66663 12.0524 9.11434 12.5001 9.66663 12.5001Z"
                              fill="#AE3628"
                            />
                          </svg>
                        </button>
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton>
                        <button //edite
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_26_747)">
                              <path
                                d="M15.2161 1.28412C14.7066 0.797222 14.0289 0.525513 13.3241 0.525513C12.6193 0.525513 11.9417 0.797222 11.4321 1.28412L1.07413 11.6421C0.732739 11.9816 0.462042 12.3855 0.277695 12.8303C0.0933478 13.2751 -0.00099165 13.752 0.000131991 14.2335V15.5001C0.000131991 15.7653 0.105489 16.0197 0.293025 16.2072C0.480562 16.3948 0.734916 16.5001 1.00013 16.5001H2.2668C2.7485 16.5014 3.22568 16.4072 3.67071 16.2228C4.11574 16.0385 4.51979 15.7677 4.85947 15.4261L15.2161 5.06812C15.7172 4.56595 15.9986 3.88552 15.9986 3.17612C15.9986 2.46672 15.7172 1.7863 15.2161 1.28412ZM3.44413 14.0121C3.13106 14.3232 2.70812 14.4985 2.2668 14.5001H2.00013V14.2335C2.0015 13.7917 2.17682 13.3682 2.48813 13.0548L10.2001 5.34479L11.1555 6.30012L3.44413 14.0121ZM13.8001 3.65412L12.5695 4.88679L11.6135 3.93079L12.8468 2.70012C12.9754 2.57717 13.1465 2.50856 13.3245 2.50856C13.5024 2.50856 13.6735 2.57717 13.8021 2.70012C13.9279 2.82716 13.9982 2.99879 13.9979 3.17753C13.9975 3.35627 13.9264 3.52761 13.8001 3.65412Z"
                                fill="#5A6ACF"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_26_747">
                                <rect
                                  width="16"
                                  height="16"
                                  fill="white"
                                  transform="translate(0 0.500122)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-4">
        <PaginationRounded defaultPage={currPage} />
      </div>
    </div>
  );
};
export default CustomTableComponent;
