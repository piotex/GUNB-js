import React from "react";

const TermsPage: React.FC = () => {
  return (
    <div className="page-container content-page">
      <h1>Regulamin i warunki użytkowania</h1>
      <div className="content-section">
        <p style={{ fontStyle: "italic", color: "#666", marginBottom: "20px" }}>
          Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
        </p>

        <h2>§1. Postanowienia ogólne</h2>
        <p>
          1. Aplikacja CzytnikCSV (zwana dalej "Aplikacją") jest narzędziem
          służącym wyłącznie do przeglądania i analizy danych w formacie CSV.
        </p>
        <p>
          2. Korzystanie z Aplikacji jest całkowicie bezpłatne i nie wymaga
          rejestracji ani podawania jakichkolwiek danych osobowych.
        </p>
        <p>
          3. Aplikacja jest dostarczana w stanie "TAK JAK JEST" (AS IS), bez
          jakichkolwiek gwarancji, wyraźnych lub dorozumianych.
        </p>
        <p>
          4. Korzystanie z Aplikacji oznacza akceptację niniejszego Regulaminu.
        </p>

        <h2>§2. Ochrona danych osobowych i RODO</h2>
        <p>
          1. Aplikacja nie zbiera, nie gromadzi, nie przetwarza, nie przechowuje
          i nie przesyła żadnych danych Użytkowników, w tym danych osobowych, na
          żaden serwer zewnętrzny ani do jakichkolwiek baz danych.
        </p>
        <p>
          2. Wszystkie operacje na plikach CSV odbywają się wyłącznie lokalnie w
          przeglądarce internetowej Użytkownika (client-side processing). Twórca
          Aplikacji nie ma dostępu do przesyłanych, przeglądanych ani
          przetwarzanych przez Użytkownika plików i danych.
        </p>
        <p>
          3. Przesłane pliki nie są wysyłane na żaden serwer zewnętrzny, nie są
          zapisywane na dysku, nie są logowane ani w żaden sposób gromadzone czy
          przechowywane poza pamięcią operacyjną przeglądarki Użytkownika.
        </p>
        <p>
          4. Aplikacja nie wykorzystuje plików cookies, local storage, session
          storage ani żadnych innych technologii śledzących do profilowania
          Użytkowników lub gromadzenia jakichkolwiek informacji.
        </p>
        <p>
          5. Twórca Aplikacji nie jest administratorem danych w rozumieniu RODO,
          ponieważ nie przetwarza, nie gromadzi i nie ma dostępu do żadnych
          danych osobowych ani innych danych Użytkowników.
        </p>
        <p>
          6. Aplikacja nie posiada backend-u, bazy danych ani jakiejkolwiek
          infrastruktury serwerowej służącej do gromadzenia lub przechowywania
          danych.
        </p>

        <h2>§3. Wyłączenie odpowiedzialności</h2>
        <p>1. Twórca Aplikacji nie ponosi żadnej odpowiedzialności za:</p>
        <ul>
          <li>
            jakiekolwiek szkody, straty, utratę danych lub innych niepożądanych
            skutków wynikających z użytkowania lub niemożności użytkowania
            Aplikacji;
          </li>
          <li>
            błędy, nieprawidłowości lub nieścisłości w przetwarzanych danych;
          </li>
          <li>
            decyzje podjęte przez Użytkownika na podstawie danych przetworzonych
            przez Aplikację;
          </li>
          <li>
            jakiekolwiek szkody pośrednie, uboczne, szczególne lub wynikowe,
            nawet jeśli Twórca został poinformowany o możliwości wystąpienia
            takich szkód;
          </li>
          <li>przerwy w działaniu Aplikacji, błędy techniczne lub awarie;</li>
          <li>
            działania osób trzecich lub inne zdarzenia pozostające poza kontrolą
            Twórcy.
          </li>
        </ul>
        <p>
          2. Maksymalna odpowiedzialność Twórcy z jakiegokolwiek tytułu jest
          ograniczona do kwoty 0 PLN (zero złotych).
        </p>

        <h2>§4. Obowiązki i odpowiedzialność Użytkownika</h2>
        <p>
          1. Użytkownik zobowiązuje się do korzystania z Aplikacji zgodnie z:
        </p>
        <ul>
          <li>obowiązującym prawem polskim i międzynarodowym;</li>
          <li>dobrymi obyczajami i zasadami współżycia społecznego;</li>
          <li>postanowieniami niniejszego Regulaminu.</li>
        </ul>
        <p>2. Użytkownik ponosi wyłączną i pełną odpowiedzialność za:</p>
        <ul>
          <li>
            wszystkie dane przesyłane do Aplikacji, ich treść, pochodzenie,
            legalność i jakość;
          </li>
          <li>
            legalność pozyskania, posiadania i przetwarzania przez siebie danych
            wczytywanych do Aplikacji;
          </li>
          <li>
            posiadanie wszelkich niezbędnych zgód, uprawnień, licencji i podstaw
            prawnych do przetwarzania danych wczytywanych do Aplikacji;
          </li>
          <li>
            zgodność swoich działań z przepisami o ochronie danych osobowych
            (RODO), w szczególności w zakresie przetwarzania danych osobowych
            zawartych w przesyłanych plikach;
          </li>
          <li>
            zapewnienie odpowiednich środków bezpieczeństwa dla przetwarzanych
            przez siebie danych;
          </li>
          <li>
            dostarczenie danych - Twórca nie weryfikuje, nie kontroluje i nie
            ponosi odpowiedzialności za dane dostarczane przez Użytkownika;
          </li>
          <li>
            wszelkie konsekwencje prawne, finansowe i organizacyjne wynikające z
            użytkowania Aplikacji oraz przetwarzania danych;
          </li>
          <li>
            przestrzeganie obowiązków wynikających z roli administratora lub
            procesora danych w przypadku przetwarzania danych osobowych.
          </li>
        </ul>
        <p>3. Użytkownik oświadcza i gwarantuje, że:</p>
        <ul>
          <li>
            posiada pełne prawo i uprawnienia do korzystania z Aplikacji oraz
            przetwarzania wczytywanych danych;
          </li>
          <li>
            dane wczytywane do Aplikacji nie naruszają praw osób trzecich, w tym
            praw autorskich, praw własności intelektualnej, dóbr osobistych oraz
            prywatności;
          </li>
          <li>
            nie wykorzystuje Aplikacji do celów niezgodnych z prawem lub
            niniejszym Regulaminem.
          </li>
        </ul>
        <p>3. Zabronione jest wykorzystywanie Aplikacji w sposób mogący:</p>
        <ul>
          <li>naruszać prawa osób trzecich;</li>
          <li>być sprzeczny z przepisami prawa;</li>
          <li>zakłócać działanie Aplikacji;</li>
          <li>naruszać dobre obyczaje.</li>
        </ul>

        <h2>§5. Prawa autorskie</h2>
        <p>1. Wszelkie prawa autorskie do Aplikacji należą do jej Twórcy.</p>
        <p>2. Użytkownik nie jest uprawniony do:</p>
        <ul>
          <li>kopiowania, modyfikowania lub rozpowszechniania Aplikacji;</li>
          <li>dokonywania inżynierii wstecznej kodu źródłowego;</li>
          <li>usuwania lub zmiany oznaczeń dotyczących praw autorskich.</li>
        </ul>

        <h2>§6. Postanowienia końcowe</h2>
        <p>
          1. Twórca zastrzega sobie prawo do zmiany Regulaminu w dowolnym czasie
          bez konieczności uprzedzenia Użytkowników.
        </p>
        <p>
          2. Twórca zastrzega sobie prawo do czasowego lub trwałego zaprzestania
          udostępniania Aplikacji bez podania przyczyny i bez ponoszenia z tego
          tytułu jakiejkolwiek odpowiedzialności.
        </p>
        <p>
          3. W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie
          mają przepisy prawa polskiego, w szczególności:
        </p>
        <ul>
          <li>Kodeksu cywilnego;</li>
          <li>Ustawy o prawie autorskim i prawach pokrewnych;</li>
          <li>RODO (Rozporządzenie UE 2016/679).</li>
        </ul>
        <p>
          4. Ewentualne spory będą rozstrzygane przez sąd właściwy rzeczowo i
          miejscowo według przepisów prawa polskiego.
        </p>
        <p>
          5. W przypadku gdyby którekolwiek z postanowień Regulaminu okazało się
          nieważne lub nieskuteczne, nie wpływa to na ważność i skuteczność
          pozostałych postanowień.
        </p>

        <h2>§7. Kontakt</h2>
        <p>
          W przypadku pytań dotyczących Aplikacji, prosimy o kontakt mailowy.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
