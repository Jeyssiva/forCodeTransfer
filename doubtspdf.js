
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


Fixes 1
-----------------

    const renderXMLToPdf = (data) => {
    return Object.keys(data).map((key, index) => {
        if (key === '_attributes') return null; // Ignore _attributes key

        const element = data[key];

        // Handle array elements properly
        if (Array.isArray(element)) {
            return element.map((item, idx) => (
                <View key={`${key}-${idx}`} style={styles.viewParent}>
                    <Text>
                        {'<'}
                        <Text style={styles.textNodeColor}>{key}</Text>
                        {'>'}
                    </Text>
                    {renderXMLToPdf(item)}
                    <Text>
                        {'</'}
                        <Text style={styles.textNodeColor}>{key}</Text>
                        {'>'}
                    </Text>
                </View>
            ));
        }

        // Handle elements with text content
        if (has(element, '_text')) {
            return (
                <Text key={key} style={styles.textProperty}>
                    {'<'}
                    <Text style={styles.textNodeColor}>{key}</Text>
                    {has(element, '_attributes') ? ` ${formatAttributes(element._attributes)}` : ''}
                    {'>'}
                    {element._text}
                    {'</'}
                    <Text style={styles.textNodeColor}>{key}</Text>
                    {'>'}
                </Text>
            );
        }

        // Handle elements with attributes
        let attributes = has(element, '_attributes') ? formatAttributes(element._attributes) : '';

        return (
            <View key={key} style={styles.viewParent}>
                <Text>
                    {'<'}
                    <Text style={styles.textNodeColor}>{key}</Text>
                    {attributes ? ` ${attributes}` : ''}
                    {'>'}
                </Text>
                {renderXMLToPdf(element)}
                <Text>
                    {'</'}
                    <Text style={styles.textNodeColor}>{key}</Text>
                    {'>'}
                </Text>
            </View>
        );
    });
};

// Function to format attributes for proper XML output
const formatAttributes = (attributes) => {
    return Object.keys(attributes).map(attr => `${attr}="${attributes[attr]}"`).join(' ');
};
Fix 2
_-_------------
const renderXMLToPdf = (data) => {
    const stack = [{ data, depth: 0 }];
    const result = [];

    while (stack.length > 0) {
        const { data, depth } = stack.pop();

        if (!data || depth > 1000) continue; // Prevents excessive depth processing

        Object.keys(data).forEach((key) => {
            if (key === '_attributes') return; // Ignore _attributes key

            const element = data[key];

            // Handle arrays properly
            if (Array.isArray(element)) {
                element.forEach((item) => stack.push({ data: { [key]: item }, depth: depth + 1 }));
            }
            // Handle elements with text content
            else if (typeof element === 'object' && '_text' in element) {
                result.push(
                    <Text key={key} style={styles.textProperty}>
                        {'<'}
                        <Text style={styles.textNodeColor}>{key}</Text>
                        {has(element, '_attributes') ? ` ${formatAttributes(element._attributes)}` : ''}
                        {'>'}
                        {element._text}
                        {'</'}
                        <Text style={styles.textNodeColor}>{key}</Text>
                        {'>'}
                    </Text>
                );
            } else if (typeof element === 'object') {
                result.push(
                    <View key={key} style={styles.viewParent}>
                        <Text>
                            {'<'}
                            <Text style={styles.textNodeColor}>{key}</Text>
                            {has(element, '_attributes') ? ` ${formatAttributes(element._attributes)}` : ''}
                            {'>'}
                        </Text>
                        {stack.push({ data: element, depth: depth + 1 })}
                        <Text>
                            {'</'}
                            <Text style={styles.textNodeColor}>{key}</Text>
                            {'>'}
                        </Text>
                    </View>
                );
            }
        });
    }

    return result;
};

// Function to format attributes
const formatAttributes = (attributes) => {
    return Object.keys(attributes).map(attr => `${attr}="${attributes[attr]}"`).join(' ');
};
Fix 3
--------
const renderXMLToPdf = (data) => {
    const stack = [{ data, key: "root" }];
    const result = [];
    const seen = new WeakSet(); // Prevents circular references

    while (stack.length > 0) {
        const { data, key } = stack.pop();

        if (!data || seen.has(data)) continue; // Prevent duplicate processing
        seen.add(data);

        Object.keys(data).forEach((nodeKey) => {
            if (nodeKey === '_attributes') return; // Ignore attributes at this stage

            const element = data[nodeKey];

            if (Array.isArray(element)) {
                element.forEach((item) => stack.push({ data: { [nodeKey]: item }, key: nodeKey }));
            } 
            else if (typeof element === 'object' && '_text' in element) {
                result.push(
                    <Text key={nodeKey} style={styles.textProperty}>
                        {'<'}
                        <Text style={styles.textNodeColor}>{nodeKey}</Text>
                        {element._attributes ? ` ${formatAttributes(element._attributes)}` : ''}
                        {'>'}
                        {element._text}
                        {'</'}
                        <Text style={styles.textNodeColor}>{nodeKey}</Text>
                        {'>'}
                    </Text>
                );
            } 
            else if (typeof element === 'object') {
                result.push(
                    <View key={nodeKey} style={styles.viewParent}>
                        <Text>
                            {'<'}
                            <Text style={styles.textNodeColor}>{nodeKey}</Text>
                            {element._attributes ? ` ${formatAttributes(element._attributes)}` : ''}
                            {'>'}
                        </Text>
                        {stack.push({ data: element, key: nodeKey })} 
                        <Text>
                            {'</'}
                            <Text style={styles.textNodeColor}>{nodeKey}</Text>
                            {'>'}
                        </Text>
                    </View>
                );
            }
        });
    }

    return result;
};

// Function to format attributes safely
const formatAttributes = (attributes) => {
    return Object.keys(attributes).map(attr => `${attr}="${attributes[attr]}"`).join(' ');
};

Fix 5
-------

const renderXMLToPdf = (data) => {
    const stack = [{ data, key: "root", parentView: [] }];
    const result = [];
    const seen = new WeakSet(); // Prevents circular references

    while (stack.length > 0) {
        const { data, key, parentView } = stack.pop();

        if (!data || seen.has(data)) continue;
        seen.add(data);

        const children = [];
        Object.keys(data).forEach((nodeKey) => {
            if (nodeKey === "_attributes") return; // Ignore attributes at this stage

            const element = data[nodeKey];

            if (Array.isArray(element)) {
                element.forEach((item) => {
                    const childView = [];
                    stack.push({ data: { [nodeKey]: item }, key: nodeKey, parentView: childView });
                    children.push(childView);
                });
            } else if (typeof element === "object" && "_text" in element) {
                children.push(
                    <Text key={nodeKey} style={styles.textProperty}>
                        {"<"}
                        <Text style={styles.textNodeColor}>{nodeKey}</Text>
                        {element._attributes ? ` ${formatAttributes(element._attributes)}` : ""}
                        {">"}
                        {element._text}
                        {"</"}
                        <Text style={styles.textNodeColor}>{nodeKey}</Text>
                        {">"}
                    </Text>
                );
            } else if (typeof element === "object") {
                const childView = [];
                stack.push({ data: element, key: nodeKey, parentView: childView });

                children.push(
                    <View key={nodeKey} style={styles.viewParent}>
                        <Text>
                            {"<"}
                            <Text style={styles.textNodeColor}>{nodeKey}</Text>
                            {element._attributes ? ` ${formatAttributes(element._attributes)}` : ""}
                            {">"}
                        </Text>
                        {childView}
                        <Text>
                            {"</"}
                            <Text style={styles.textNodeColor}>{nodeKey}</Text>
                            {">"}
                        </Text>
                    </View>
                );
            }
        });

        parentView.push(...children);
    }

    return result;
};

// Function to format attributes safely
const formatAttributes = (attributes) => {
    return Object.keys(attributes)
        .map((attr) => `${attr}="${attributes[attr]}"`)
        .join(" ");
};
