<%@ Page Title="Consulta" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Consulta.aspx.cs" Inherits="UserWeb.Consulta" %>

<asp:Content ID="Content3" ContentPlaceHolderID="cphMasterScripts" runat="server">
    <script src="<%= Page.ResolveUrl("~/Scripts/General/Custom.js") %>"></script>
    <script src="<%= Page.ResolveUrl("~/Scripts/General/Utilidades.js") %>"></script>
</asp:Content>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="jumbotron">
        <h2>Consulta de Usuarios</h2>
    </div>
    
    <div class="card">

        <asp:UpdatePanel ID="UPEditar" runat="server">
            <ContentTemplate>

                <div class="card-body">
                    <div class="col-md-12">
                        <div class="table-responsive">
                            <table class="table table-bordered text-center tbl-listado-usuarios" data-paging="true" data-paging-size="10">
                                <thead>
                                    <tr>
                                        <th data-name="Id" data-visible="false">id</th>
                                        <th data-name="Nombre">Nombre</th>
                                        <th data-name="FechaNacimiento">Fecha Nacimiento</th>
                                        <th data-name="Sexo">Sexo</th>
                                        <th data-name="acciones1" data-formatter="modulo_consulta.formatoBotonEditar">Editar</th>
                                        <th data-name="acciones2" data-formatter="modulo_consulta.formatoBotonEliminar">Eliminar</th>

                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
<script src="<%= Page.ResolveUrl("~/Scripts/Consulta/Consulta.js") %>"></script>
 <script>
        jQuery(function ($) {
            $('.tbl-listado-usuarios').footable({
                "paging": {
                    "size": 30
                }
            });
        });
 </script>
</asp:Content>