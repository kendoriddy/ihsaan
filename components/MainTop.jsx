import Link from "next/link";

function MainTop({ breadcrumbData }) {
  return (
    <section className="bg-neutral-100">
      {/* Breadcrumb */}
      <div className="text-sm p-4">
        {/* Two Levels */}
        <div>
          {breadcrumbData.length === 1 && (
            <>
              <Link href="/" className="link">
                Home
              </Link>{" "}
              / <span>{breadcrumbData[0].name}</span>
            </>
          )}
        </div>
        {/* Three Levels */}
        <div>
          {breadcrumbData.length === 2 && (
            <>
              <Link href="/" className="link">
                Home
              </Link>{" "}
              /{" "}
              <Link href={breadcrumbData[0].path} className="link">
                {breadcrumbData[0].name}
              </Link>{" "}
              / <span className="capitalize">{breadcrumbData[1].name}</span>
            </>
          )}
        </div>
      </div>

      {/* Page name */}
      <div className="h-[80px] lg:min-h-[100px] flex justify-center items-center pb-8">
        <p className="text-3xl font-bold">{breadcrumbData[0].name}</p>
      </div>
    </section>
  );
}

export default MainTop;
