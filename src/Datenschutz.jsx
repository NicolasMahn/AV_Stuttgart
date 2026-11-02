import React, { useEffect } from 'react';
import { useTab } from './menu/TabContext';

import './App.css';

const Datenschutz = () => {
    const [currentTab, setCurrentTab] = useTab();

    useEffect(() => {
        setCurrentTab("Datenschutzerklärung"); 
        return () => setCurrentTab("");
        }, [setCurrentTab]);


    return (
        <div>
            <p>Stand: 26.04.24</p>

            <h2>1. Datenschutz auf einen Blick</h2>
            <h3>Allgemeine Hinweise</h3>
            <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.</p>

            <h3>Datenerfassung auf unserer Website</h3>
            <h4>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
            <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>

            <h4>Wie erfassen wir Ihre Daten?</h4>
            <p>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</p>
            <p>Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie unsere Website betreten.</p>

            <h4>Wofür nutzen wir Ihre Daten?</h4>
            <p>Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.</p>

            <h4>Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
            <p>Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.</p>

            <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3>Datenschutz</h3>
            <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>

            <h3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
            <p>Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.</p>

            <h2>Kontaktinformation</h2>
            <p>Für Fragen zum Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.</p>
        </div>
    );
}

export default Datenschutz;
