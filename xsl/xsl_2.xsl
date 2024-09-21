<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <html>
            <head>
                <title>Лобанов Иван Задание 2 (XSL)</title>
            </head>
            <body>
                <h4 id="author" title="GossJS" style="display: none">Лобанов Иван</h4>
                <xsl:apply-templates />
            </body>
        </html>
    </xsl:template>
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()" />
        </xsl:copy>
    </xsl:template>
    <xsl:template match="графика">
        <svg>
            <xsl:apply-templates select="@*|node()" />
        </svg>
    </xsl:template>
    <xsl:template match="графика/эллипс">
        <ellipse>
            <xsl:apply-templates select="@*|node()" />
        </ellipse>
    </xsl:template>
    <xsl:template match="/root/графика/@ширина">
        <xsl:attribute name="width">
            <xsl:value-of select="." />
        </xsl:attribute>
    </xsl:template>
    <xsl:template match="/root/графика/@высота">
        <xsl:attribute name="height">
            <xsl:value-of select="." />
        </xsl:attribute>
    </xsl:template>
    <xsl:template match="/root/графика/эллипс/@заливка">
        <xsl:attribute name="fill">
            <xsl:value-of select="." />
        </xsl:attribute>
    </xsl:template>
    <xsl:template match="/root/графика/эллипс/@ободок">
        <xsl:attribute name="stroke">
            <xsl:value-of select="." />
        </xsl:attribute>
    </xsl:template>
    <xsl:template match="/root/графика/эллипс/@ширина-ободка">
        <xsl:attribute name="stroke-width">
            <xsl:value-of select="." />
        </xsl:attribute>
    </xsl:template>
    <xsl:template match="/root/графика/эллипс/@cx">
        <xsl:attribute name="cx">
            <xsl:value-of select="." />
        </xsl:attribute>
    </xsl:template>
    <xsl:template match="/root/графика/эллипс/@cy">
        <xsl:attribute name="cy">
            <xsl:value-of select="." />
        </xsl:attribute>
    </xsl:template>
    <xsl:template match="/root/графика/эллипс/@rx">
        <xsl:attribute name="rx">
            <xsl:value-of select="." />
        </xsl:attribute>
    </xsl:template>
    <xsl:template match="/root/графика/эллипс/@ry">
        <xsl:attribute name="ry">
            <xsl:value-of select="." />
        </xsl:attribute>
    </xsl:template>
</xsl:stylesheet>