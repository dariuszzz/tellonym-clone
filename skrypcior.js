function waliduj() {

    const wielkaLitera =(tekst)=> { return tekst.charAt(0).toUpperCase() + tekst.slice(1) }

    const sprawdz =(element,typ,nazwa)=>{

        let wejscie = element.value

        if (wejscie == "") { return `Pole ${nazwa.replace("_"," ")} jest puste` }

        let generic // deklaruje tutaj bo js nie liczy case'ów jako osobnych bloków (pls fix)

        // 1 - tekst, 2 - data, 3 - kolor, 4 - radio // 3 i 4 nie ma nizej wyjasnilem

        switch(typ) {
            case 1:
                
                generic = `Nieprawidłowe ${nazwa}`

                // liczby w nazwisku nie są cool
                if ((/[0-9]/g.test(wejscie))) { return generic }

                // pierwszy znak musi być literą
                if ((/^[^A-z]/.test(wejscie))) { return generic }

                // imie i nazwisko muszą mieć przynajmniej 2 litery (nie wiem czemu)
                if (wejscie.length < 2) { return `${wielkaLitera(nazwa)} jest za krótkie`}

            break
            case 2:

                generic = `Nieprawidłowa ${nazwa.replace("_"," ")}`

                alert(wejscie)

                // fajne przypomnienie regexa ale prawdopodobnie nie działa
                // string musi być zestawem 3 liczb odzielonych minusami, z tego pierwsza
                // nie może być dłuższa niż 4 cyfry a dwie następne niż 2
                if (/[0-9]{1,4}[-][0-9]{1,2}[-][0-9]{1,2}$/.test(wejscie)) {

                    let t = wejscie.split("-")
                    let dzien = t[2]
                    let miesiac = t[1]
                    let rok = t[0]

                    // brakuje mi motywacji żeby sprawdzać dokładniej
                    if (!(dzien >= 1 && dzien <= 31)) { return generic }
                    if (!(miesiac >= 1 && miesiac <= 12)) { return generic }

                    let rokTeraz = new Date().getFullYear()
                    if (!(rok >= rokTeraz-150 && rok <= rokTeraz)) { return generic }
                    
                } else {
                    return generic
                }


            break

            // kolor nie wymaga sprawdania bo przeglądarka nie pozwoli ci wpisać niczego dziwnego
            // plec nie wymaga sprawdania bo nie da się wcisnąć obu ratio na raz
        }


        return ""

    }

    let form = document.forms["super_formularz"]

    // 1 - tekst, 2 - data, 3 - kolor, 4 - radio
    const pola = [
        ["imie",1],
        ["nazwisko",1],
        ["data_urodzenia",2],
        ["ulubiony_kolor",3],
    ]

    // sklejanie błędów w jedną wiadomość
    let wiadomosc = ""
    pola.forEach(pole => {
        let blad = sprawdz(form[pole[0]],pole[1],pole[0])
        wiadomosc += blad == ""?"":blad + "\n" // wtawianie enteru w alercie
    })

    if (wiadomosc == "") { 
        alert("Wszystko super")
    } else {
        alert("KIEPŚCIUTKO\n" + wiadomosc)
    }

}