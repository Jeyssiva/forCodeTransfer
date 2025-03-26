
import { StyleSheet, Page, View, Document, Text } from "@react-pdf/renderer";
import { has } from "lodash";
import xmlJs from 'xml-js';
const styles = StyleSheet.create({
    page: {
        backgroundColor: "white",
        color: "black",
        marginTop: 10,
        marginLeft: 20,
        marginRight: 10
    },
    section: {
        //   marginLeft: 20,
        //   marginRight: 10
    },
    viewer: {
        width: window.innerWidth, //the pdf viewer will take up all of the width and height
        height: window.innerHeight,
    },
    text: {
        fontSize: '12'
    },
    textNodeColor: {
        color: 'red'
    },
    textProperty: {
        marginLeft: '15px',
        fontSize: '12'
    },
    viewParent: {
        fontSize: '12',
        marginLeft: '10px'
    }
});

export default function PdfViewer() {
    // Parse XML content into JavaScript object
    const mxMessage = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
      <Body>
        <Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">
          <FIToFICstmrCdtTrf>
            <CdtTrfTxInf>
              <PmtTpInf>
                <SvcLvl>
                  <Cd>G001</Cd>
                </SvcLvl>
                <SvcLvl>
                  <Cd>G001d</Cd>
                </SvcLvl>
              </PmtTpInf>
              <IntrBkSttlmAmt Ccy="EUR">1445.00</IntrBkSttlmAmt>
              <IntrBkSttlmDt>2025-03-24</IntrBkSttlmDt>
              <InstdAmt Ccy="">1445.00</InstdAmt>
              <InstrForNxtAgt>
                <InstrInf>/ACC/BPER BANCA SPA VIA VALENTINI,</InstrInf>
              </InstrForNxtAgt>
              <InstrForNxtAgt>
                <InstrInf>//18 59100 PRATO</InstrInf>
              </InstrForNxtAgt>
            </CdtTrfTxInf>
          </FIToFICstmrCdtTrf>
        </Document>
      </Body>`

     const convertDataXMLtoJSONWithDeclaration = (bodyData) => {
        const bodyDataOptions = {
            compact: true, spaces: 0, ignoreComment: true
        }
        const xmlDataJson = xmlJs.xml2json(bodyData, bodyDataOptions);
        const namedDataJson = JSON.parse(xmlDataJson);
        return namedDataJson;
    }

    const parsedXML = convertDataXMLtoJSONWithDeclaration(mxMessage);
  
    const renderXMLToPdf = (data) => {
        return Object.keys(data).map((key, index) => {
            if (key === '_attributes') return;
            // if(!isNaN(key)) return;
            if (has(data[key], '_text')) {
                return (
                    <Text style={styles.textProperty}>
                        {'<'}<Text style={styles.textNodeColor}>{`${key}`}</Text>{'>'}
                        {`${data[key]._text}`}
                        {'</'}<Text style={styles.textNodeColor}>{`${key}`}</Text>{'>'}
                    </Text>
                )
            } else {
                let attributes = '';
                if (has(data[key], '_attributes')) {
                    const attriList = data[key]['_attributes'];
                    Object.keys(attriList).map(key => {
                        attributes = attributes + `${key} = "${attriList[key]}" `;
                    })
                }
                return (
                    <View style={styles.viewParent}>
                        <Text>
                            {'<'}
                            {attributes !== ''
                                ? <><Text style={styles.textNodeColor}>{`${key}`}</Text> {attributes}</>
                                : <Text style={styles.textNodeColor}>{`${key}`}</Text>
                            }
                            {'>'}
                        </Text>
                        {renderXMLToPdf(data[key])}
                        <Text>
                            {'</'}
                            <Text style={styles.textNodeColor}>{`${key}`}</Text>
                            {'>'}
                        </Text>
                    </View>
                )
            }
        })
    }

    const getDeclarations = () => {
        if (parsedXML._declaration && parsedXML._declaration._attributes) {
            let attributes = ""
            const attriList = parsedXML._declaration._attributes
            Object.keys(attriList).map(key => {
                attributes = attributes + `${key} = "${attriList[key]}" `;
            })
            return <Text style={styles.text}>{`<?xml ${attributes} ?>`}</Text>
        }
        return null
    }

    const MXMTDocument = () => {
        return (
            <Document>
                <Page size={'A4'} style={styles.page}>
                    <View style={styles.section}>
                        <Text>MX Message</Text>
                        <Text>------------------</Text>
                        {getDeclarations()}
                        <Text style={styles.text}>{'<'}
                            <Text style={styles.textNodeColor}>{'DataPDU'}</Text>
                            {' xmlns="urn:swift:saa:xsd:saa.2.0">'}</Text>
                        {renderXMLToPdf(parsedXML['DataPDU'])}
                        <Text style={styles.text}>
                            {'</'}
                            <Text style={styles.textNodeColor}>{'DataPDU'}</Text>
                            {'>'}
                        </Text>
                    </View>
                </Page>
            </Document>
        )
    }

    return (
        <MXMTDocument/>
    )
}

Actual Output using the above code - <?xml version = "1.0" encoding = "UTF-8" standalone = "no" ?>
<DataPDU xmlns="urn:swift:saa:xsd:saa.2.0">
<Body>
<Document xmlns = "urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08" >
<FIToFICstmrCdtTrf>
<CdtTrfTxInf>
<PmtTpInf>
<SvcLvl>
<0>
<Cd>G001</Cd>
</0>
<1>
<Cd>G001d</Cd>
</1>
</SvcLvl>
</PmtTpInf>
<IntrBkSttlmAmt>1445.00</IntrBkSttlmAmt>
<IntrBkSttlmDt>2025-03-24</IntrBkSttlmDt>
<InstdAmt>1445.00</InstdAmt>
<InstrForNxtAgt>
<0>
<InstrInf>/ACC/BPER BANCA SPA VIA VALENTINI,</InstrInf>
</0>
<1>
<InstrInf>//18 59100 PRATO</InstrInf>
</1>
</InstrForNxtAgt>
</CdtTrfTxInf>
</FIToFICstmrCdtTrf>
</Document>
</Body>
</DataPDU>

Issues
1. Ccy is not printing
2. 0,1,2 is not expected, Instead of this, expecting ParentName
For Ex - instead of 
<InstrForNxtAgt>
<0>
<InstrInf>/ACC/BPER BANCA SPA VIA VALENTINI,</InstrInf>
</0>
<1>
<InstrInf>//18 59100 PRATO</InstrInf>
</1>
</InstrForNxtAgt>

should be 

<InstrForNxtAgt>
<InstrInf>/ACC/BPER BANCA SPA VIA VALENTINI,</InstrInf>
</InstrForNxtAgt>
<InstrForNxtAgt>
<InstrInf>//18 59100 PRATO</InstrInf>
</InstrForNxtAgt>

Same for SvcLvl, Kindly refer mxMessage
Note - InstrForNxtAgt, SvcLvl is not static, same concept should be applicable for other tags
