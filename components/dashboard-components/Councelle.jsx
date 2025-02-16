import React from "react";

const Councelle = () => {
  return (
    <div>
      <div className="mt-4 flex-1 max-h-[500px] overflow-y-scroll relative py-4">
        <div className="p-2 font-bold  bg-white">My Councelle List</div>
        <table className="table-auto w-full rounded bg-gray-50 ">
          <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
            <tr className="border text-primary">
              <th className=" border px-4 py-2">Basic Info</th>
              <th className=" border px-4 py-2">Created Date</th>
              <th className=" border px-4 py-2">Status</th>
              <th className=" border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="even:bg-gray-100 hover:bg-gray-200">
              <td className="border px-4 py-2">Dummy</td>
              <td className="border px-4 py-2">Dummy</td>
              <td className="border px-4 py-2">Dummy</td>
              <td className="border px-4 py-2">Dummy</td>
            </tr>
            <tr className="even:bg-gray-100 hover:bg-gray-200">
              <td className="border px-4 py-2">Dummy</td>
              <td className="border px-4 py-2">Dummy</td>
              <td className="border px-4 py-2">Dummy</td>
              <td className="border px-4 py-2">Dummy</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Councelle;
