var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({
    apikey: '44634B4139424E75584177666A543272557566654F4F656435515574775A4741594F592F444A46486F37673D'
});

export function sendKavenegarSMS(receptor, token)
{
    api.VerifyLookup({
        //message: token,
        //sender: "10007119",
        receptor: receptor,
        token: token,
        template: 'fsEntCode2'
    },
        function (response, status)
        {
            console.log(response);
            console.log(status);
        });
}
