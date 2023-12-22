const People = () => {
  const people = [
    "Programmer",
    "Engineer",
    "Doctor",
    "Student",
    "Teacher",
    "Lawyer",
  ];
  return (
    <div className="mt-20">
      <h1 className="text-center text-2xl font-bold">Our App Community</h1>
      <p className="text-sm text-center text-gray-500 w-1/2 mx-auto">
        People who opt to utilize our application find a diverse and
        comprehensive array of features tailored to their needs.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-5">
        {people.map((item, idx) => (
          <div
            key={idx}
            className="p-10 border-[2px] hover:shadow-md text-center font-semibold">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;
