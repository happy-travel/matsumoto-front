import { API, redirect } from "core";
import { PAYMENT_METHODS } from "enum";
import { $accommodation, $notifications, $payment } from "stores";

const taskSubmitBookingForm = (values, { setSubmitting }) => {
    setSubmitting(true);

    const contract = $accommodation.selected.roomContractSet;
    const search = $accommodation.search.request;
    let roomDetails = [];

    for (let i = 0; i < contract?.rooms?.length; i++) {
        const adults = contract?.rooms[i]?.adultsNumber;
        const total = adults + contract?.rooms[i]?.childrenAges.length;
        let passengers = [];

        for (let j = 0; j < total; j++)
            passengers.push({
                title: values.room[i].passengers[j].title,
                firstName: values.room[i].passengers[j].firstName,
                lastName: values.room[i].passengers[j].lastName,
                age: j < adults ? 35 : contract?.rooms[i]?.childrenAges[j-adults],
                ...( j == 0 ? { isLeader: true } : {} )
            });

        roomDetails.push({
            type: contract.rooms[i]?.type,
            passengers
        })
    }

    const request = {
        searchId: $accommodation.search.id,
        htId: $accommodation.selected.accommodationFullDetails.htId,
        roomContractSetId: contract.id,
        nationality: search.nationality,
        paymentMethod: $payment.paymentMethod,
        residency: search.residency,
        mainPassengerName: roomDetails[0].passengers[0].firstName + " " + roomDetails[0].passengers[0].lastName,
        agentReference: values.agentReference,
        roomDetails: roomDetails,
        features: [],
        itineraryNumber: values.itineraryNumber,
        supplier: $accommodation.selected.accommodation.source
    };
    $accommodation.setBookingRequest(request);

    if ([PAYMENT_METHODS.ACCOUNT, PAYMENT_METHODS.OFFLINE].includes($payment.paymentMethod))
        API.post({
            url: (
                PAYMENT_METHODS.ACCOUNT == $payment.paymentMethod ?
                    API.BOOK_BY_ACCOUNT :
                    API.BOOK_FOR_OFFLINE
            ),
            body: request,
            success: result => {
                if (!result?.bookingDetails?.referenceCode) {
                    $notifications.addNotification("Error occurred during account payment");
                    return;
                }
                $payment.setPaymentResult(null);
                $payment.setSubject(result.bookingDetails.referenceCode);
                redirect("/accommodation/confirmation");
            },
            error: () => setSubmitting(false)
        });

    if ($payment.paymentMethod == PAYMENT_METHODS.CARD)
        API.post({
            url: API.ACCOMMODATION_BOOKING,
            body: request,
            success: result => {
                $payment.setSubject(result, $accommodation.selected.roomContractSet.rate.finalPrice);
                redirect("/payment/form");
            },
            error: () => setSubmitting(false)
        });
};

export default taskSubmitBookingForm;
