'use strict'

app.controller('PessoaController', function(PessoaService, EmpresaService, EnderecoService, UtilitarioService, $state, $stateParams) {

	let vm = this

	vm.IdPessoa = $stateParams._id;

	vm.Pessoa    = {}
	vm.Endereco  = {}
	vm.Enderecos = []
	vm.Pessoas   = []
	vm.Empresas  = []

	// Caso passar o Id de uma Pessoa
	if ( vm.IdPessoa ) {
		let _id = $stateParams._id
		PessoaService.ListarUm(_id)
		.then(function(res){
			vm.Pessoa = res.data
		})
		EnderecoService.Listar(_id)
		.then(function(ret){
			vm.Enderecos = ret.data
		})
	}

	// Listar Pessoas
	vm.Listar = function() {
		PessoaService.Listar()
		.then(function(res){
			vm.Pessoas = res.data
		})
	}

	// Gravar Pessoa
	vm.Gravar = function() {
		PessoaService.Gravar(vm.Pessoa)
		.then(function(res){
			$state.go('menu.frmPessoa', { _id: res.data._id })
		})
	}

	// Listar Empresas
	vm.ListarEmpresas = function() {
		EmpresaService.Listar()
		.then(function(res){
			vm.Empresas = res.data
		})
	}

	// Gravar Endereco
	vm.GravarEndereco = function() {
		vm.Endereco._idPessoa = vm.IdPessoa
		EnderecoService.Gravar(vm.Endereco)
		.then(function(res){
			if(res.data._id){
				vm.Endereco = res.data
			}
			EnderecoService.Listar(vm.IdPessoa)
			.then(function(ret){
				vm.Enderecos = ret.data
				$('.modal-novo-endereco').modal('hide')
			})
		})
	}


	vm.NovoEndereco = function() {
		vm.Endereco = {}
		$('.modal-novo-endereco').modal('show')
	}

	vm.AlterarEndereco = function(endereco) {
		vm.Endereco = angular.copy(endereco)
		$('.modal-novo-endereco').modal('show')
	}


	// Consulta CEP
	vm.ConsultarCEP = function() {
		let cep = vm.Endereco.cep
		let idEndereco = vm.Endereco._id ? vm.Endereco._id : null

		if (cep.length == 8) {
			UtilitarioService.ConsultarCEP(cep)
			.then(function(res){
				if (!res.data.erro) {
					res.data.cep = res.data.cep.replace(/[^0-9]/, '')
					vm.Endereco  = res.data
					if (idEndereco) {
						vm.Endereco._id = idEndereco
					}
				}
			})
		}
	}

})