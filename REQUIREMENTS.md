# Requisiti — SLOPLINE × Arke

## Problema e destinatari

- Problema osservato (interviste simulate durante la giornata di prova, vedi Notion «Arke × SLOPLINE»): nessuno vede lo stato dell'ordine; le richieste arrivano da email, WhatsApp, telefono e vengono ritrascritte a mano su Danea; materiali e date non sono verificati.
- Utenti principali: ufficio ordini (Edo), commerciali e agenti (Pietro), grafica (Arianna), produzione (Michela), titolare (Arnaldo).
- Responsabile della decisione prodotto: Da decidere (lato SLOPLINE, Arnaldo come sostenitore ipotizzato).

## Obiettivo della prima versione

- Risultato: dalla posta in arrivo a un ordine strutturato in pochi clic, con stato visibile a tutti.
- Misura di successo: tempo per inserire un ordine (da misurare, obiettivo dimezzare); richieste di stato a Pietro/Edo/Arianna (da misurare). Dati reali: Da decidere nel pilota.
- Vincoli: prototipo in circa una settimana, solo dati fittizi, nessuna scrittura autonoma dell'agente.
- Fuori ambito: Danea/Shopify, login reale, pianificazione produzione, calcolo date da carico macchine.

## Flussi e criteri di accettazione

### Flusso 1: dalla email all'ordine

- Attore e bisogno: l'ufficio ordini vuole trasformare una richiesta in ordine senza ritrascrivere.
- Ingresso: email o trascrizione WhatsApp nella pagina «Posta».
- Passi: l'agente AI legge, interroga catalogo/anagrafica/magazzino, produce una bozza con dubbi; la persona corregge e conferma.
- Esito: ordine in stato «Nuovo ordine» con storico e collegamento alla email.
- Criteri verificabili:
  1. Data una email d'ordine chiara, quando l'agente la analizza, allora la bozza ha prodotto, quantita' e cliente corretti rispetto al catalogo.
  2. Data una quantita' vaga o un prodotto fuori catalogo, allora compaiono in «Da controllare a mano» e la confidenza non e' «alta».
  3. Nessun ordine esiste finche' la persona non preme «Conferma e crea ordine».
  4. Una richiesta di stato non crea righe d'ordine ma propone una risposta e il collegamento all'ordine.

### Flusso 2: stato dell'ordine

- Attore: chiunque debba rispondere «a che punto e'?».
- Esito: lista e scheda ordine con fase, ritardo, storico e avanzamento di stato.
- Criterio: un ordine in ritardo (data promessa passata, non spedito) e' evidenziato in lista.

## Requisiti trasversali

- Accessibilita': contrasto leggibile, controlli con etichetta; verifica formale Da decidere.
- Privacy: nessun dato personale reale (vedi `BACKEND.md`).

## Ipotesi da validare

- La maggior parte del ritardo nasce prima della produzione (approvazioni, materiali): da misurare con il pilota.
- L'estrazione con conferma umana e' abbastanza accurata per far risparmiare tempo a Edo: da misurare su 20-30 email reali.
