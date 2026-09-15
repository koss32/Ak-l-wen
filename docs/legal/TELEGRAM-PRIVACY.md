# Datenschutzhinweise für den Telegram-Buchungsbot @ak_loewenbot

[Deutsch](#de) · [Русский](#ru)

<section id="de" lang="de" aria-labelledby="de-title" tabindex="-1">

<h2 id="de-title">Deutsch — maßgebliche Fassung</h2>

**Freigabestand: am 15.09.2026 vom Verantwortlichen zur Veröffentlichung freigegeben.** Diese Freigabe bestätigt den Inhalt dieser Fassung, nicht ihre bereits erfolgte Veröffentlichung oder eine technische Aktivierung des Bots. Dieser Text ist keine Rechtsberatung; eine anwaltliche Prüfung wird nicht behauptet.

**Hinweis-/Einwilligungsversion:** `telegram-2026-09-15-v1`  
**Freigabedatum:** 2026-09-15

Die deutsche Fassung ist maßgeblich. Die nachfolgende russische Übersetzung dient der Verständlichkeit.

### 1. Verantwortlicher und Kontakt

Verantwortlicher für die Verarbeitung über diesen Bot ist:

**AK-LOEWEN gGmbH**  
vertreten durch **Dietrich Schmelzer**  
**Anschrift des Verantwortlichen / registrierte Geschäftsanschrift: Parallelstraße 6, 42719 Solingen**  
E-Mail: **aklggmbh@gmail.com**  
Telefon: **+49 157 30447730**  
Registergericht: **Amtsgericht Wuppertal**  
Handelsregister: **HRB 36478**

Die Unternehmens-, Kontakt- und Registerangaben wurden am 15.09.2026 vom Verantwortlichen bestätigt.

Die Trainingsadresse ist hiervon zu unterscheiden: **Werwolf 8, 42651 Solingen**. Sie ist die Adresse des Trainingsortes und nicht automatisch die ladungsfähige Anschrift des Verantwortlichen.

### 2. Wofür der Bot da ist

Der Bot beantwortet Informationsfragen und kann Anfragen für Trainingsgruppen entgegennehmen. Er ist kein Notdienst und kein medizinischer Beratungsdienst. Bitte senden Sie keine Gesundheitsdaten, Diagnosen, Verletzungen, Versicherungsdaten oder sonstigen sensiblen Angaben in Kommentare oder Nachrichten. Für eine Trainingsanfrage genügen die im Bot abgefragten Angaben.

### 3. Welche Daten verarbeitet werden

Je nach Nutzung können insbesondere verarbeitet werden:

- die Telegram-Nutzer-ID und Chat-ID sowie technische Nachrichten- und Zustellinformationen;
- die von Telegram übermittelte Sprache bzw. eine im Bot ausgewählte Sprache;
- bei einer Anfrage: Telegram-Kontakt oder Telefonnummer und Name der teilnehmenden Person, Alter, Angaben zu erwachsener oder minderjähriger Person und gegebenenfalls Rolle/Angaben der elterlichen, gesetzlichen oder sonst autorisierten Vertretung;
- gewünschte Richtung/Gruppe, gewünschte Zeiten bzw. Terminwünsche und ein freiwilliger Kommentar;
- Zeitpunkt, Version und Inhalt der Einwilligungs-/Bestätigungsangaben, soweit der Bot diese abfragt, sowie Status, Änderungs- und Versionsinformationen der Anfrage;
- Nachrichten und Antworten des zuständigen Personals innerhalb des Bot-Vorgangs;
- nach einer Bestätigung: der bestätigte Termin und die für die Bearbeitung erforderlichen Statusangaben;
- nur bei ausdrücklicher Auswahl: die Aktivierung einer Erinnerung etwa zwei Stunden vor einem künftigen bestätigten Termin;
- für die technische Zustellung: Outbox-Inhalte, Empfänger, Zustellversuche, Zeitpunkte, Telegram-Nachrichten-IDs und andere Delivery-/Leasing-Metadaten.

Telegram übermittelt und verarbeitet Nachrichten außerdem nach den eigenen Bedingungen und Datenschutzhinweisen. Die Telegram-Chat-Historie liegt außerhalb der Aufbewahrungssteuerung dieser Bot-Anwendung. Telegram-ID und Chat-ID werden benötigt, damit eine Anfrage dem richtigen privaten Chat zugeordnet und beantwortet werden kann; eine anonyme Buchung über diesen Bot ist daher nicht möglich.

### 4. Zwecke und Rechtsgrundlagen

Wir verarbeiten die Daten, um Informationen bereitzustellen, eine Trainingsanfrage entgegenzunehmen und zu bearbeiten, Rückfragen zu stellen, einen Termin zu bestätigen oder abzusagen, den Status der eigenen Anfrage anzuzeigen und Nachrichten an den richtigen privaten Telegram-Chat zuzustellen. Soweit die Verarbeitung zur Durchführung vorvertraglicher Maßnahmen auf Anfrage der betroffenen Person erforderlich ist, ist die Rechtsgrundlage **Art. 6 Abs. 1 lit. b DSGVO**.

Eine optionale Terminerinnerung wird nur nach einer gesonderten ausdrücklichen Auswahl eingerichtet. Rechtsgrundlage ist dafür **Art. 6 Abs. 1 lit. a DSGVO**. Die Auswahl kann über `/stop` für alle Anfragen oder über die Ausschalt-Schaltfläche bei der betreffenden Anfrage widerrufen werden. `/reminders` aktiviert Erinnerungen und ist keine Abmeldefunktion. Eine Erinnerung wird nicht allein deshalb angelegt, weil eine Anfrage eingereicht wurde.

Technische Protokollierung, Zustellsteuerung, Missbrauchsvermeidung, Authentifizierung der internen Bot-Endpunkte und die Sicherstellung eines stabilen und sicheren Betriebs können auf **Art. 6 Abs. 1 lit. f DSGVO** gestützt werden. Die konkreten berechtigten Interessen und eine Interessenabwägung sind vom Verantwortlichen zu prüfen und zu dokumentieren.

Bei Minderjährigen soll eine Anfrage durch einen Elternteil, eine gesetzlich sorgeberechtigte, gesetzliche oder sonst autorisierte vertretende Person gestellt werden. Der Bot erfasst die dafür vorgesehenen Angaben. Die Prüfung der Vertretungsberechtigung und etwaige zusätzliche Anforderungen liegen in der Verantwortung des Verantwortlichen; die Erfassung im Bot ersetzt diese Prüfung nicht.

### 5. Empfänger und eingesetzte Dienste

Für Betrieb und Zustellung sind nach der derzeitigen technischen Architektur insbesondere folgende Dienste vorgesehen:

- **Telegram**, über den die Kommunikation und Bot-Zustellung erfolgt;
- **Vercel**, auf dessen Infrastruktur die Bot-Endpunkte bereitgestellt werden können;
- **Upstash Redis**, als dauerhafter Speicher für Bot-Zustand und Zustellwarteschlange;

**Tasklet ist nach aktuellem Projektstand nur ein Entwicklungs-/Übergabewerkzeug und kein geplanter Produktivdienst für die Verarbeitung von Bot-Nutzerdaten. Es wird daher nicht als Empfänger des produktiven Bot-Datenverkehrs aufgeführt.**

Diese Aufzählung beschreibt die vorgesehenen technischen Dienste, nicht automatisch die vollständige rechtliche Empfängerliste. Vor Produktivstart sind die tatsächlich verwendeten Konten, Auftragsverarbeitungsverträge, Unterauftragnehmer, Datenverarbeitungsorte, Übermittlungen in Drittländer und gegebenenfalls erforderliche Garantien (einschließlich Standardvertragsklauseln) anhand der aktuellen Anbieterbedingungen und Verträge zu prüfen. Diese Hinweise behaupten hierzu keine bestimmten Datenstandorte, DPA- oder SCC-Abdeckung und keine abschließende Liste weiterer Empfänger.

Die jeweiligen Anbieter können Daten auch nach ihren eigenen Datenschutzinformationen verarbeiten. Telegram nennt in seiner aktuellen Datenschutzerklärung Telegram Messenger Inc. als Anbieter und Verantwortlichen für die Telegram-Dienste; für Nutzer im EWR ist außerdem ein Vertreter nach Art. 27 DSGVO benannt. Vercel veröffentlicht einen aktuellen Data Processing Addendum (DPA) für die Verarbeitung von Kundendaten auf unterstützten Tarifen. Upstash veröffentlicht ebenfalls einen DPA für die Verarbeitung von Kundendaten. Vor Produktivstart ist zu prüfen, welche konkreten Konten/Tarife und Regionen tatsächlich eingesetzt werden und ob die notwendigen Vertragsbedingungen/DPA für die verwendete Konfiguration gelten.

Aktuelle Referenzen:
- Telegram Privacy Policy: <https://telegram.org/privacy>
- Vercel DPA: <https://vercel.com/legal/dpa>
- Upstash DPA: <https://upstash.com/trust/dpa.pdf>

### 6. Aufbewahrung und Löschung

Der Bot speichert den veränderlichen Anwendungszustand in Redis. Anfragen und Client-Datensätze werden grundsätzlich durch eine rollierende Aufbewahrungslogik von etwa 30 Tagen seit der letzten relevanten Änderung erfasst; abgelaufene Daten werden bei geeigneten Vorgängen bereinigt. Zustell-/Outbox- und Deduplizierungsdaten werden grundsätzlich ungefähr 30 Tage ab ihrer Erstellung vorgehalten. Sitzungen und Aktionsdaten laufen ungefähr nach 30 Minuten ab. Dies ist **keine Zusage einer harten, in jedem System exakt nach 30 Tagen erfolgenden Löschung**. Telegram-Chatverläufe und sonstige Daten beim Anbieter werden dadurch nicht gelöscht und unterliegen dessen eigenen Regeln.

Eine betroffene Person kann unter den gesetzlichen Voraussetzungen Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit verlangen sowie der Verarbeitung widersprechen, soweit die gesetzlichen Voraussetzungen erfüllt sind. Eine erteilte Einwilligung kann jederzeit mit Wirkung für die Zukunft widerrufen werden. Für Lösch- oder sonstige Datenschutzanfragen kontaktieren Sie bitte **aklggmbh@gmail.com** und geben Sie möglichst die betreffende Telegram-Chat-ID oder andere zur Zuordnung erforderliche Informationen an; senden Sie dabei keine unnötigen sensiblen Daten.

`/stop` deaktiviert die Betreuung und Erinnerungen für alle noch gespeicherten Anfragen dieses Telegram-Nutzers und löscht den laufenden Entwurf; es storniert keine bereits gebuchten Termine und zieht bereits versendete oder gerade laufende HTTP-Anfragen nicht zurück. Eine Buchung kann mit `/cancel [ID]` zur Stornierung ausgewählt werden. Für eine vollständige Löschanfrage sollte zusätzlich die oben genannte Kontaktadresse verwendet werden, weil Telegram seine eigene Chat-Historie verwaltet.

Eine alternative Kontaktmöglichkeit außerhalb von Telegram ist die E-Mail an **aklggmbh@gmail.com**. Die sichere Zuordnung und Bearbeitung solcher Anfragen liegt in der Verantwortung des Verantwortlichen.

### 7. Sicherheit

Der Bot verwendet unter anderem getrennte Authentifizierungsgeheimnisse für seine internen Endpunkte, begrenzte Zustellversuche, Zugriffskontrollen für Personalvorgänge und eine dauerhafte Zustellwarteschlange. Der Verantwortliche muss die tatsächliche Konfiguration, Rollenvergabe, Geheimnisverwaltung, Protokollierung, Backups und Löschabläufe regelmäßig prüfen. Es gibt keine Zusage, dass ein Internetdienst oder Telegram vollständig risikofrei ist.

Personalantworten und Buchungsdetails werden nur für die Bearbeitung der Anfrage an dafür vorgesehene Personal-Chats übermittelt. Der Verantwortliche ist für die Festlegung und Dokumentation der Zugriffsberechtigungen und des Datenschutzes in Gruppen-Chats (insbesondere bei ForceReply-Funktionen) zuständig.

### 8. Beschwerderecht

Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren. Für den Sitz des Verantwortlichen in Nordrhein-Westfalen ist insbesondere folgende Aufsichtsbehörde relevant:

**Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)**  
Kavalleriestraße 2–4  
40213 Düsseldorf  
Telefon: +49 211 38424-0  
E-Mail: poststelle@ldi.nrw.de  
Web: <https://www.ldi.nrw.de/>

Eine Beschwerde kann unter den gesetzlichen Voraussetzungen auch bei einer anderen zuständigen Aufsichtsbehörde, insbesondere am gewöhnlichen Aufenthaltsort oder am Ort des mutmaßlichen Verstoßes, eingereicht werden.

### 9. Änderung und Veröffentlichung

Diese Hinweise werden vor Aktivierung auf der vom Verantwortlichen bestimmten, dauerhaft erreichbaren HTTPS-Adresse veröffentlicht. Die veröffentlichte Versionsnummer muss mit der im Bot angezeigten Einwilligungsversion übereinstimmen. Änderungen an Zweck, Rechtsgrundlage, Empfängern, Aufbewahrung oder Betroffenenrechten sind vorab zu prüfen und eine neue Version ist gegebenenfalls erneut zu bestätigen.

</section>

<section id="ru" lang="ru" aria-labelledby="ru-title" tabindex="-1">

<h2 id="ru-title">Русский перевод — приоритет имеет немецкий текст</h2>

**Статус: утверждено ответственным лицом для публикации 15.09.2026.** Это утверждение содержания данной версии, а не подтверждение состоявшейся публикации или технического включения бота. Текст не является юридической консультацией; проверка юристом не заявляется.

**Версия уведомления/согласия:** `telegram-2026-09-15-v1`  
**Дата утверждения:** 2026-09-15

Приоритет имеет немецкая версия. Русский перевод предоставлен для удобства понимания.

### 1. Ответственное лицо и контакты

Ответственным за обработку через бота является:

**AK-LOEWEN gGmbH**, представитель **Dietrich Schmelzer**  
**Зарегистрированный официальный адрес: Parallelstraße 6, 42719 Solingen**  
E-mail: **aklggmbh@gmail.com**  
Телефон: **+49 157 30447730**  
Регистр: **Amtsgericht Wuppertal, HRB 36478**

Сведения о компании, контактные и регистрационные данные подтверждены ответственным лицом 15.09.2026.

Адрес тренировок нужно отличать от адреса ответственного: **Werwolf 8, 42651 Solingen**. Это адрес места тренировок, а не автоматически официальный адрес ответственного.

### 2. Назначение бота

Бот отвечает на информационные вопросы и принимает заявки в тренировочные группы. Это не служба экстренной помощи и не медицинская консультация. Не отправляйте в комментариях или сообщениях медицинские сведения, диагнозы, травмы, страховые данные или другие чувствительные сведения. Для заявки достаточно запрашиваемых ботом данных.

### 3. Какие данные могут обрабатываться

В зависимости от использования это могут быть идентификатор пользователя Telegram и идентификатор чата, язык из Telegram или выбранный в боте язык; контакт Telegram или номер телефона и имя участника, возраст, сведения о совершеннолетии/несовершеннолетии и, при необходимости, роль и данные родителя, законного или иного уполномоченного представителя; направление/группа, желаемое расписание или дата и необязательный комментарий; время, версия и содержание подтверждений согласия; статус и история изменений заявки; сообщения и ответы сотрудников; после подтверждения — подтверждённая дата и нужные статусные сведения; только при отдельном выборе — напоминание примерно за два часа до будущей подтверждённой встречи; а также данные технической доставки: содержание очереди, получатель, попытки и время доставки, ID сообщений Telegram и другие метаданные.

Telegram обрабатывает сообщения также по собственным правилам. История чата Telegram находится вне контроля хранения этого приложения. ID Telegram и чата нужны, чтобы связать заявку с правильным личным чатом и ответить; анонимное бронирование через этот бот невозможно.

### 4. Цели и правовые основания

Данные используются для информации, приёма и обработки заявки, уточняющих вопросов, подтверждения/отмены, просмотра статуса и доставки сообщений в правильный чат. В той мере, в какой обработка необходима для преддоговорных действий по запросу субъекта данных, основание — **ст. 6(1)(b) GDPR/DSGVO**.

Необязательное напоминание включается только после отдельного явного выбора; основание — **ст. 6(1)(a) GDPR/DSGVO**. Его можно отключить через `/stop` для всех заявок или кнопкой отключения в конкретной заявке. Команда `/reminders` включает напоминания, а не отключает их. Сам факт подачи заявки не включает напоминание.

Техническая безопасность, аутентификация внутренних endpoint’ов, предотвращение злоупотреблений и стабильная доставка могут основываться на **ст. 6(1)(f) GDPR/DSGVO**; конкретный законный интерес и баланс интересов ответственный должен проверить и документировать.

Заявку несовершеннолетнего должен подавать родитель, опекун или другой уполномоченный представитель. Проверка полномочий и дополнительные требования находятся в ведении ответственного; сбор сведений в боте не заменяет такую проверку.

### 5. Получатели и сервисы

По текущей архитектуре для production предполагаются **Telegram**, **Vercel** и **Upstash Redis**. **Tasklet используется только как инструмент разработки/передачи проекта и не считается production-получателем данных пользователей бота**, пока его не подключат к работающему контуру отдельно.

До запуска нужно проверить фактически используемые аккаунты, тарифы, регионы, договоры обработки, субподрядчиков и международные передачи. Актуальные ссылки: Telegram Privacy Policy <https://telegram.org/privacy>, Vercel DPA <https://vercel.com/legal/dpa>, Upstash DPA <https://upstash.com/trust/dpa.pdf>.

### 6. Хранение и удаление

Состояние приложения хранится в Redis. Заявки и клиентские записи обычно охватываются скользящей логикой хранения около 30 дней с последнего существенного изменения; истёкшие данные очищаются при подходящих операциях. Данные очереди доставки и дедупликации обычно хранятся около 30 дней с создания, сессии и action-данные — около 30 минут. Это **не обещание жёсткого удаления ровно через 30 дней во всех системах**. История Telegram удаляется по правилам Telegram и этим приложением не контролируется.

При законных условиях можно требовать доступ, исправление, удаление, ограничение обработки и переносимость данных, возражать против обработки и отозвать согласие на будущее. Пишите на **aklggmbh@gmail.com**, по возможности укажите ID чата Telegram; не отправляйте лишние чувствительные сведения.

`/stop` отключает обслуживание и напоминания для всех сохранённых заявок пользователя Telegram и очищает текущий черновик; он не отменяет уже забронированные занятия и не отзывает уже отправленные/выполняющиеся HTTP-запросы. Для отмены бронирования используется `/cancel [ID]`. Для полного удаления следует дополнительно написать на e-mail, поскольку историю Telegram контролирует Telegram. Альтернативный канал — **aklggmbh@gmail.com**; безопасная идентификация и обработка таких запросов находятся в ведении ответственного.

### 7. Безопасность и жалоба

Проект предусматривает отдельные секреты аутентификации, ограничения доставки, контроль доступа сотрудников и постоянную очередь доставки. Фактические настройки, права, секреты, журналы и процедуры удаления должен регулярно проверять ответственный. Полной безрисковости интернет-сервисов не гарантируется.

Для компании с зарегистрированным адресом в Nordrhein-Westfalen релевантным надзорным органом является **LDI NRW**: Kavalleriestraße 2–4, 40213 Düsseldorf, тел. +49 211 38424-0, e-mail: poststelle@ldi.nrw.de, <https://www.ldi.nrw.de/>.

### 8. Публикация

Уведомление будет опубликовано до включения бота на постоянно доступном HTTPS-адресе, выбранном ответственным лицом. Версия на странице должна совпадать с версией, которую показывает бот. Изменения целей, оснований, получателей, хранения или прав нужно проверить заранее и при необходимости получить новое подтверждение.

</section>
