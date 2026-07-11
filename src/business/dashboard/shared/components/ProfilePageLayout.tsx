

const ProfilePageLayout = () => {
  return (
  <div className="flex justify-center mt-10 md:mt-20 px-4  items-center">
     <div className="md:w-1/2  w-full  mx-auto bg-white rounded shadow p-6">
        <h3 className="font-semibold mb-4">Personal Information</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="py-2 text-slate-600">Name</td>
              <td className="py-2 font-medium">Mr jack</td>
            </tr>
            <tr>
              <td className="py-2 text-slate-600">Phone No</td>
              <td className="py-2 font-medium">+4415426250</td>
            </tr>
            <tr>
              <td className="py-2 text-slate-600">Email</td>
              <td className="py-2 font-medium">abc@gmail.com</td>
            </tr>
            <tr>
              <td className="py-2 text-slate-600">Currency</td>
              <td className="py-2 font-medium">United States US Dollar</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-blue-600 text-white rounded">Edit</button>
        </div>
      </div>
  </div>
  )
}

export default ProfilePageLayout