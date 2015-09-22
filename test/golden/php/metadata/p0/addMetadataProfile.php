<?php
require_once('../../lib/KalturaClient.php');
require_once('Credentials.php');

$config = new KalturaConfiguration(PARTNER_ID);
$config->serviceUrl = "https://www.kaltura.com/";
$client = new KalturaClient($config);
$ks = $client->session->start(
  SECRET,
  USER_ID,
  SESSION_TYPE,
  PARTNER_ID,
  null, null);
$client->setKS($ks);

$metadataProfile = new KalturaMetadataProfile();
$metadataProfile->metadataObjectType = KalturaMetadataObjectType::ENTRY;
$metadataProfile->name = "foo";
$metadataProfile->systemName = "bar";


$xsdData = "<xsd:schema xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\n  <xsd:element name=\"metadata\">\n    <xsd:complexType>\n      <xsd:sequence>\n        <xsd:element id=\"md_5F84A7E4-5509-993D-CE9C-3B60C0713775\" name=\"Somefield\" minOccurs=\"0\" maxOccurs=\"1\" type=\"textType\">\n          <xsd:annotation>\n            <xsd:documentation></xsd:documentation>\n            <xsd:appinfo>\n              <label>somefield</label>\n              <key>somefield</key>\n              <searchable>true</searchable>\n              <timeControl>false</timeControl>\n              <description></description>\n            </xsd:appinfo>\n          </xsd:annotation>\n        </xsd:element>\n      </xsd:sequence>\n    </xsd:complexType>\n  </xsd:element>\n  <xsd:complexType name=\"textType\">\n    <xsd:simpleContent>\n      <xsd:extension base=\"xsd:string\"/>\n    </xsd:simpleContent>\n  </xsd:complexType>\n  <xsd:complexType name=\"dateType\">\n    <xsd:simpleContent>\n      <xsd:extension base=\"xsd:long\"/>\n    </xsd:simpleContent>\n  </xsd:complexType>\n  <xsd:complexType name=\"objectType\">\n    <xsd:simpleContent>\n      <xsd:extension base=\"xsd:string\"/>\n    </xsd:simpleContent>\n  </xsd:complexType>\n  <xsd:simpleType name=\"listType\">\n    <xsd:restriction base=\"xsd:string\"/>\n  </xsd:simpleType>\n</xsd:schema>";

$viewsData = null;

try {
  $result = $client->metadataProfile->add(
    $metadataProfile, 
    $xsdData, 
    $viewsData);
  $result = (object) $result;
?>
<?php if($result->message && $result->code) { ?>
        <h1><?php echo $result->message ?></h1>
	<?php } else { ?>
	    <h2>Metadata Profile Object <?php echo $result->name ?></h2>
	    <p><b>System Name:</b> <?php echo $result->systemName ?></p>
	    <p>XSD:
	    <pre>
	    <?php echo htmlspecialchars($result->xsd) ?>
	    </pre>
	    </p>
<?php } ?>

<?php

} catch (Exception $e) {
  echo $e->getMessage();
}
?>
