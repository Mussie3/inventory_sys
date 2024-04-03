import services from "@/services/connect";

export const POST = async (request) => {
  const {} = await request.json();

  try {
    const expanseData = await services.GetAllExapase();
    const cashData = await services.GetAllCash();

    let today = new Date();

    const filteredExapase = expanseData.filter((expanse) => {
      const dateToCheck = new Date(expanse.datetime);
      if (
        dateToCheck.getFullYear() === today.getFullYear() &&
        dateToCheck.getMonth() === today.getMonth() &&
        dateToCheck.getDate() === today.getDate()
      ) {
        return true;
      } else return false;
    });

    const filteredCash = cashData.filter((ca) => {
      const dateToCheck = new Date(ca.datetime);
      if (
        dateToCheck.getFullYear() === today.getFullYear() &&
        dateToCheck.getMonth() === today.getMonth() &&
        dateToCheck.getDate() === today.getDate()
      ) {
        return true;
      } else return false;
    });

    let TotalExpanse = 0;
    let TotalCash = 0;

    filteredExapase.forEach((item) => {
      TotalExpanse = TotalExpanse + Number(item.amount);
    });

    filteredCash.forEach((item) => {
      TotalCash = TotalCash + Number(item.amount);
    });

    const Available = TotalCash - TotalExpanse;

    return new Response(
      JSON.stringify({
        result: {
          TotalExpanse: TotalExpanse,
          TotalCash: TotalCash,
          Available: Available,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
