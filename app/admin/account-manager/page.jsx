"use client";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Modal from "@/components/validation/Modal";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import { useEffect } from "react";
import FormikControl from "@/components/validation/FormikControl";
import { Form, Formik } from "formik";
import { usePost } from "@/hooks/useHttp/useHttp";
import Loader from "@/components/Loader";
import AuthButton from "@/components/AuthButton";
import { accountSchema } from "@/components/validationSchemas/ValidationSchema";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { userRole } from "@/utils/redux/slices/auth.reducer";
import { useSelector } from "react-redux";
function Page() {
  const queryClient = useQueryClient();
  const currentRoute = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteaccounts, setDeleteaccounts] = useState(false);
  const [toEditaccounts, setToEditaccounts] = useState(null);
  const [deletingaccounts, setDeletingaccounts] = useState(null);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const role = useSelector(userRole);
  // const {
  //   isLoading,
  //   data: accountsList,
  //   isFetching,
  //   refetch,
  // } = useFetch("accounts", `/accounts/all`);
  const accounts = [
    {
      id: "1",
      account_name: "Markesh Ilias",
      date_created: "24 May,2024",
      account_type: "Admin",
    },
    {
      id: "2",
      account_name: "Kehinde Admin",
      date_created: "10 May,20244",
      account_type: "Super Admin",
    },
    {
      id: "2",
      account_name: "Mr Saliu",
      date_created: "27 May,2024",
      account_type: "Super Admin",
    },
  ];
  const options = [
    { key: "Admin", value: "admin" },
    { key: "Super Admin", value: "super_admin" },
  ];
  const [accountsMode, setaccountsMode] = useState("create");
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setaccountsMode("");
    setOpen(false);
    setToEditaccounts(null);
  };
  const accountsInitialValues = {
    full_name: toEditaccounts?.accounts_first_name || "",
    email: toEditaccounts?.accounts_email || "",
    role: toEditaccounts?.role || "",
  };
  const { mutate: createNewaccounts, isLoading: isCreatingaccounts } = usePost(
    "/auth/register",
    {
      onSuccess: (response) => {
        toast.success("account created successfully");
        queryClient.invalidateQueries("accounts");
        handleClose();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );
  // const { mutate: updateaccounts, isLoading: isUpdatingaccounts } = usePut(
  //   "/accounts",
  //   {
  //     onSuccess: (response) => {
  //       const { data } = response;
  //       toast.success("accounts updated successfully");
  //       queryClient.invalidateQueries("accounts");
  //       handleClose();
  //     },
  //     onError: (error) => {
  //       toast.error(error.response.data.message);
  //     },
  //   }
  // );
  // const { mutate: accountsDelete, isLoading: isDeletingaccounts } = useDelete(
  //   "/accounts",
  //   {
  //     onSuccess: (data) => {
  //       toast.success("deleted successfully");
  //       queryClient.invalidateQueries("accounts");
  //       setDeleteaccounts(false);
  //       setDeletingaccounts(null);
  //     },
  //     onError: (error) => {
  //       toast.error(error.response.data.message);
  //     },
  //   }
  // );
  const handleSubmit = (values) => {
    const { role, email, first_name } = values;
    const payload = {
      email: email,
      roles: [role],
      first_name: first_name,
      last_name: "admin",
      password: "hesoyam",
    };
    if (accountsMode === "create") {
      createNewaccounts(payload);
    } else {
      updateaccounts({ id: toEditaccounts?.id, data: payload });
    }
  };
  // const handleDeleteaccounts = (id) => {
  //   accountsDelete(id);
  // };
  // useEffect(() => {
  //   refetch();
  // }, [open, deleteaccounts]);
  return (
    <div className="relative">
      {/* Header */}
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      {/* Main */}
      <main className="flex relative">
        {/* Sidebar */}
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />
        {/* Main Body */}
        <section
          className=" lg:ml-[250px] w-screen px-2"
          style={{
            "@media (min-width: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}
        >
          {/* Content goes here */}
          <div className="p-4">
            {/* Top */}
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold"></div>
              <div
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setaccountsMode("create");
                  setOpen(true);
                }}
              >
                Add New Account
              </div>
            </div>

            <div className="py-4 font-bold text-lg">Manage Admin Accounts</div>

            {/* Space */}
            <div className="py-4"></div>

            {/* accounts  */}
            <section className="rounded border px-4 py-4 overflow-x-scroll">
              <table className="table-auto w-full rounded bg-gray-50 ">
                <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                  <tr className="border text-red-600">
                    <th className=" border px-4 py-2">Account Holder Name</th>
                    <th className=" border px-4 py-2">Account Type</th>
                    <th className=" border px-4 py-2">Date Created</th>
                    <th className=" border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts?.length > 0 ? (
                    accounts.map((accounts) => (
                      <tr className="even:bg-gray-100" key={accounts?.id}>
                        <td className="border px-4 py-2">
                          {accounts?.account_name}
                        </td>
                        <td className="border px-4 py-2">
                          {accounts?.account_type}
                        </td>
                        <td className="border px-4 py-2">
                          {accounts?.date_created}
                        </td>
                        <td className="border pl-4 py-2 w-[170px]">
                          <span
                            className="px-2 py-1 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700"
                            onClick={() => {
                              setToEditaccounts(accounts);
                              setaccountsMode("edit");
                              setOpen(true);
                            }}
                          >
                            Edit
                          </span>
                          <span
                            className="px-2 py-1 bg-red-600 cursor-pointer text-white rounded hover:bg-red-700 ml-1"
                            onClick={() => {
                              setDeletingaccounts(accounts);
                              setDeleteaccounts(true);
                            }}
                          >
                            Delete
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="border px-4 py-2 text-center">
                        No data to show at the moment
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
            {/* ADD,UPDATE accounts */}
            <Modal
              isOpen={open}
              handleClose={handleClose}
              title={
                accountsMode === "create" ? "New account" : "Update account"
              }
            >
              <div className="my-2 flex flex-col gap-2">
                <Formik
                  initialValues={accountsInitialValues}
                  validationSchema={accountSchema}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    <div className="flex flex-col gap-2">
                      <div>
                        <FormikControl name="name" placeholder="Admin Name" />
                      </div>
                      <div>
                        <FormikControl
                          name="number"
                          placeholder="Admin Number"
                        />
                      </div>
                      <div>
                        <FormikControl name="email" placeholder="Email" />
                      </div>
                      <div>
                        <FormikControl
                          control={"select"}
                          name="role"
                          placeholder="Role"
                          options={options}
                        />
                      </div>
                      <div className="w-full flex justify-center">
                        <AuthButton
                          isLoading={isCreatingaccounts}
                          text={accountsMode === "create" ? "submit" : "update"}
                        />
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            </Modal>
            <Modal
              isOpen={deleteaccounts}
              handleClose={() => {
                setDeleteaccounts(false);
                setDeletingaccounts(null);
              }}
              title={"Delete accounts"}
            >
              <div>
                <p>Are you sure you want to delete accounts </p>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => handleDeleteaccounts(deletingaccounts?.id)}
                  variant="contained"
                  sx={{
                    textTransform: "initial",
                    backgroundColor: "darkred !important",
                    color: "white !important",
                  }}
                >
                  confirm
                </Button>
              </div>
            </Modal>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
