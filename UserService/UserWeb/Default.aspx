<%@ Page Title="Usuarios" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="UserWeb.Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="jumbotron">
        <h2>Usuario</h2>
    </div>

    <div class="row">
        <div class="col-md-4">
            <h2>Nombre</h2>
            <asp:TextBox Cssclass="form-control txtNombreUsuario" runat="server" ID="txtNombreUsuario"></asp:TextBox>
        </div>
        <div class="col-md-4">
            <h2>Fecha de Nacimiento</h2>
             <asp:TextBox ID="txtFechaNacimiento" CssClass="form-control txtFechaNacimiento" TextMode="Date" runat="server"></asp:TextBox>
        </div>
        <div class="col-md-4">
            <h2>Sexo</h2>
            <asp:DropDownList ID="DDSexo" runat="server" CssClass="form-control DDSexo"  AppendDataBoundItems="true">
                <asp:ListItem Value="F">Femenino</asp:ListItem>
                <asp:ListItem Value="M">Masculino</asp:ListItem>
                <asp:ListItem Value="O">Otro</asp:ListItem>
            </asp:DropDownList>
        </div>
    </div>
    <br />
    <div>
       <button class="btn btn-primary btn-guardar-registro" type="button" >Guardar</button>
    </div>

<script src="<%= Page.ResolveUrl("~/Scripts/Default/Default.js") %>"></script>
</asp:Content>
