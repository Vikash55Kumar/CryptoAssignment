import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Input,
    ModalFooter,
    Button,
    Link,
    useDisclosure,
  } from "@nextui-org/react";

import React, { useEffect } from "react";
import {useDispatch} from "react-redux"
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"
import { updateCryptoTarget } from "../../action/cryptoAction";
import img from "../../assets/target.jpg"
  
  export default function CryptoList({ crypto = [], cryptoTarget=[] }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [page] = React.useState(1);
    const [filterValue] = React.useState("");
    const [statusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedCurrency, setSelectedCurrency] = React.useState(null); // Store selected currency

    const [sortDescriptor] = React.useState({
      column: "market_cap_rank",
      direction: "ascending",
    });
  

    const mergeCryptoData = (cryptoArray, targetArray) => {
      const targetMap = new Map(
        targetArray.map((target) => [target.cryptoname, target.target])
      );
  
      return cryptoArray.map((cryptoItem) => {
        const [date, time] = cryptoItem.date.split("T"); // Extract date and time
        return {
          ...cryptoItem,
          date, // Add a date property
          time: time.split(".")[0], // Add a time property without milliseconds
          target: targetMap.get(cryptoItem.name) || "N/A", // Add target or default to "N/A"
        };
      });
    };
  
    const processedData = React.useMemo(
      () => mergeCryptoData(crypto, cryptoTarget),
      [crypto, cryptoTarget]
    );

    // Target set
    useEffect(() => {
      processedData.forEach((cryptoItem) => {
        const currentPrice = parseFloat(cryptoItem.current_price);
        const target = parseFloat(cryptoItem.target);
  
        if (!isNaN(currentPrice) && !isNaN(target) && currentPrice > target) {
          toast.success(
            `🎉 Target achieved for ${cryptoItem.name}! Current Price: $${currentPrice}, Target: $${target}`
          );
        }
      });
    }, [processedData]);

    const filteredItems = React.useMemo(() => {
      let filteredCrypto = [...processedData];
  
      if (filterValue) {
        filteredCrypto = filteredCrypto.filter((crypto) =>
          crypto.name.toLowerCase().includes(filterValue.toLowerCase())
        );
      }
      if (statusFilter !== "all") {
        filteredCrypto = filteredCrypto.filter((crypto) =>
          crypto.status === statusFilter
        );
      }
  
      return filteredCrypto;
    }, [processedData, filterValue, statusFilter]);
  
    const items = React.useMemo(() => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
  
      return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);
  
    const sortedItems = React.useMemo(() => {
      return [...items].sort((a, b) => {
        const first = a[sortDescriptor.column];
        const second = b[sortDescriptor.column];
        const cmp = first < second ? -1 : first > second ? 1 : 0;
  
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
    }, [sortDescriptor, items]);
  
    const handleOpen = (currency) => {
      setSelectedCurrency(currency);
      onOpen();
    };
  
    const onClose = () => {
      setSelectedCurrency(null);
    };
  
    const onSubmit = async(e) => {
      e.preventDefault();
      const targetValue = e.target.elements["target-value"].value; // Extract input value
      const name = selectedCurrency?.name;

      const myForm = {
        target:targetValue,
        cryptoname:name
      };
      
      try {
          const response = await dispatch(updateCryptoTarget(myForm));
          if (response.status === 200) {
              toast.success("Target Update Successfully!");
              navigate("/");
              onClose();
          } else {
              toast.error(response?.data?.message || "Target failed!", 'error');
          }
      } catch (err) {
          toast.error(err.response?.data?.message || err.message || 'Target failed!', 'error');
      }
    };
    const renderCell = React.useCallback((crypto, columnKey) => {
      const cellValue = crypto[columnKey];
  
      switch (columnKey) {
        case "name":
          return (
            <div className="flex items-center mr-7 md:mr-0">
              <img src={crypto.image} alt={cellValue} className="w-10 h-10 rounded-full mr-3" />
              <span>{cellValue}</span>
            </div>
          );
        case "date":
        case "time":
          return cellValue; // Directly display date or time
        case "market_cap_rank":
        case "market_cap":
          return cellValue.toLocaleString(); // Format large numbers
        case "target":
          return cellValue;
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-8">
              <Link content="Edit user" className="cursor-pointer" onPress={() => handleOpen(crypto)}>
              <img src={img} className="w-10 h-10 rounded-full mr-3" />
              </Link>
            </div>
          )
        default:
          return cellValue;
      }
    }, []);
  
    return (
      <div className="p-4 rounded-large shadow-small m-4">
        <h2 className="text-center font-bold text-4xl text-slate-600">
          Crypto Currency Live Price
        </h2>
        <div className="rounded-s-lg border-sky-700 outline-4">
          {/* Table Header */}
          <div className="flex flex-col gap-4 pt-4 pl-4 pr-4">
            <div className="flex justify-between items-center">
              <span className="text-default-400 text-small">
                Total {crypto.length} Crypto Currencies
              </span>
              <label className="flex items-center text-default-400 text-small">
                Rows per page:
                <select
                  className="bg-transparent outline-none text-default-400 text-small"
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </label>
            </div>
          </div>
          {/* Table */}
          <Table aria-label="Crypto Prices Table">
            <TableHeader
              columns={[
                {name: "RANK", uid: "market_cap_rank"},
                {name: "NAME", uid: "name"},
                {name: "DATE", uid: "date"},
                {name: "TIME", uid: "time"},
                {name: "MARKET CAP ", uid: "market_cap"},
                {name: "VOLUME", uid: "volume"},
                // {name: "LOW_24h", uid: "low_24h"},
                {name: "CURRENT PRICE", uid: "current_price"},
                {name: "TARGET", uid: "target"},
                {name: "SET TARGET", uid: "actions"},
              ]}
            >
              {(column) => (
                <TableColumn key={column.uid}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sortedItems}>
              {(item) => (
                <TableRow key={item.market_cap_rank}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div>
        {/* Add new Course */}
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
          <ModalContent>
          <form onSubmit={onSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              Set Target for {selectedCurrency?.name} <br/>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Current Value"
                labelPlacement="outside"
                name="current-value"
                placeholder={selectedCurrency?.current_price}
                isDisabled
              />              
              <Input
              isRequired
              errorMessage="Please enter a valid target"
              label="Target Value"
              labelPlacement="outside"
              name="target-value"
              placeholder="Enter Target Value in doller"
            />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </form>
          </ModalContent>
        </Modal> 
      </div>
      </div>
    );
  }
  







      // const processCryptoData = (cryptoArray) => {
    //   return cryptoArray.map((crypto) => {
    //     const [date, time] = crypto.date.split("T");
    //     return {
    //       ...crypto,
    //       date, // Add a date property
    //       time: time.split(".")[0], // Add a time property without milliseconds
    //     };
    //   });
    // };
  
    // const processedData = React.useMemo(() => processCryptoData(crypto), [crypto]);
