import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClipboardCopy } from 'lucide-react';

const QuotationConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('retail');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const outputRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const convertQuotation = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter a quotation to convert.');
      return;
    }

    try {
      const lines = input.split('\n').map(line => line.trim()).filter(line => line !== '');
      let result = format === 'retail' ? convertRetailFormat(lines) : convertWholesaleFormat(lines);
      setOutput(result);
    } catch (err) {
      console.error('Conversion error:', err);
      setError('An error occurred during conversion. Please check your input format and try again.');
    }
  };

  const convertRetailFormat = (lines) => {
    let result = '🚗 *Quotation for Tires* 🚗\n\n';
    for (let i = 0; i < lines.length; i += 4) {
      if (i + 3 >= lines.length) break;
      result += `🛞 *${lines[i]}*\n`;
      result += `🌍 *${lines[i+1]}*\n`;
      result += `💵 *${lines[i+2]}* (Inclusive of 5% VAT)\n`;
      result += `📅 *${lines[i+3]} Years Warranty*\n\n`;
    }
    result += `*Price includes:*\n`;
    result += `🔧 Free *Tyre Installation*\n`;
    result += `⚖️ Free *Wheel Balancing*\n`;
    result += `💨 Free *Nitrogen Filling*\n`;
    result += `🔄 Free *10,000 KM Tyre Rotation* (Lifetime)\n`;
    result += `🛠️ Free *Car Inspection*\n`;
    result += `📏 Free *Alignment Inspection*\n\n`;
    result += `Let me know if you'd like to proceed! 😊`;
    return result;
  };

  const convertWholesaleFormat = (lines) => {
    let result = '';
    for (let i = 0; i < lines.length; i += 4) {
      if (i + 3 >= lines.length) break;
      const priceWithoutAED = lines[i+2].replace('AED', '').trim();
      const priceNumber = parseFloat(priceWithoutAED);
      const priceWithVAT = (priceNumber * 1.05).toFixed(2);

      result += `Product: *${lines[i]}*\n`;
      result += `Origin: *${lines[i+1]}*\n`;
      result += `Price: *${lines[i+2]} per tire* (price inclusive of VAT= ${priceWithVAT})\n`;
      result += `Warranty: *${lines[i+3]} Years Warranty*\n\n`;
    }
    return result.trim();
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setCopySuccess('');
  };

  const copyToClipboard = () => {
    if (outputRef.current) {
      outputRef.current.select();
      try {
        document.execCommand('copy');
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        setError('Failed to copy text. Please try again or copy manually.');
      }
      window.getSelection().removeAllRanges();
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{
      background: 'linear-gradient(135deg, #4a0000 0%, #8B0000 100%)'
    }}>
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="bg-white p-6 border-b border-gray-200">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">WhatsApp Quotation Converter</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">Input Message</Label>
              <p className="text-sm text-gray-500 mb-2">
                Please enter your quotation in the following format:
                <br />
                Tire Description
                <br />
                MADE IN [COUNTRY]
                <br />
                AED [Price]
                <br />
                [Number]
                <br />
                (Repeat for each tire)
              </p>
              <Textarea
                id="input"
                placeholder="Paste your input message here..."
                value={input}
                onChange={handleInputChange}
                rows={8}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Output Format</Label>
              <RadioGroup value={format} onValueChange={setFormat} className="flex space-x-4">
                <div className=" flex items-center">
                  <RadioGroupItem value="retail" id="retail" />
                  <Label htmlFor="retail" className="ml-2">Retail</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="wholesale" id="wholesale" />
                  <Label htmlFor="wholesale" className="ml-2">Wholesale</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex space-x-4">
              <Button 
                onClick={convertQuotation}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded"
              >
                Convert
              </Button>
              <Button 
                onClick={clearAll}
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded"
              >
                Clear
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {output && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="output" className="block text-sm font-medium text-gray-700">Converted Message</Label>
                  <Button
                    onClick={copyToClipboard}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                {copySuccess && <p className="text-green-600 text-sm mb-2">{copySuccess}</p>}
                <Textarea
                  id="output"
                  ref={outputRef}
                  value={output}
                  readOnly
                  rows={12}
                  className="w-full bg-gray-50 border-gray-300 rounded-md shadow-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuotationConverter;
