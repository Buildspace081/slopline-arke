# 0002 - L'agente produce una bozza, la persona conferma

- Data: 2026-10-07
- Stato: Accettata
- Responsabile: Gennaro Basile

## Contesto

Le email sono ambigue ("tipo 35 o 40") e possono contenere testo ostile. Un ordine sbagliato blocca materiali e produzione.

## Opzioni considerate

- Agente che crea l'ordine: piu' veloce; errori e prompt injection hanno effetto diretto.
- Agente che propone, umano che conferma: un clic in piu'; errori intercettati e dubbi visibili.

## Decisione

Tool dell'agente in sola lettura; uscita strutturata (`proposalSchema`) con `doubts` e `confidence`; unica scrittura in `confirmProposal`, dopo conferma umana.

## Conseguenze

- Fiducia e tracciabilita' (`agent_runs`, nota sull'ordine). Il risparmio di tempo dipende dalla qualita' delle bozze: da misurare.

## Verifica o revisione

Dopo la valutazione su email reali: se l'accuratezza e' alta si puo' valutare la conferma automatica solo per i casi a confidenza alta.
